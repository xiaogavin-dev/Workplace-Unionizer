import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import useWorkplaces from "@/hooks/useWorkplaces";
import { useAppDispatch } from "@/lib/redux/hooks/redux";
import { setUserUnions } from "@/lib/redux/features/user_unions/userUnionsSlice";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import "./app-sidebar.css";

export function AppSidebar({
  chats,
  unionName,
  unionId,
  role,
  userId
}: {
  chats: object[];
  unionName: string;
  unionId: string;
  role: string
  userId: string
}) {
  console.log("ROle", role);
  const [isPollModalOpen, setPollModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [previousVote, setPreviousVote] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isUnionDropdownOpen, setUnionDropdownOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>("");
  const [copyMessage, setCopyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState<{
    id: string;
    employeeCount: number;
    name: string;
  } | null>(null);

  const dispatch = useAppDispatch()
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const toggleUnionDropdown = () => {
    setUnionDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setUnionDropdownOpen(false);
      }
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setInviteModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (path: string, query?: Record<string, string>) => {
    setUnionDropdownOpen(false);
    if (query) {
      const queryString = new URLSearchParams(query).toString();
      router.push(`${path}?${queryString}`);
    } else {
      router.push(path);
    }
  };

  // Use the custom hook to fetch workplaces
  const { workplaces, loading, error } = useWorkplaces(unionId);

  const fetchVotes = async (workplaceId: string) => {
    try {
      const response = await fetch(
        `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/polls/votes?workplaceId=${workplaceId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch votes");
      }
      const data = await response.json();
      setVotes({ yes: data.yesCount, no: data.noCount });
      setTotalVotes(data.yesCount + data.noCount);
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  const openPollModal = (workplace: { id: string; employeeCount: number; name: string }) => {
    console.log("Opening poll for workplace:", workplace);
    if (workplace && workplace.id && workplace.employeeCount) {
      setSelectedWorkplace(workplace);
      setTotalEmployees(workplace.employeeCount);
      setPollModalOpen(true);
      fetchVotes(workplace.id);
    } else {
      console.error("Invalid workplace object passed to openPollModal:", workplace);
    }
  };

  const handleVote = async () => {
    if (selectedWorkplace && selectedOption) {
      try {
        console.log("Submitting vote for:", selectedWorkplace);
        const response = await fetch(
          `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/polls/vote`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              workplaceId: selectedWorkplace.id,
              userId,
              vote: selectedOption,
              action: previousVote ? "update" : "increment",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit vote.");
        }

        const data = await response.json();

        setVotes({ yes: data.yesCount, no: data.noCount });
        setTotalVotes(data.totalVotes);
        setPreviousVote(selectedOption);
        setVoted(true);

        setMessage("Your vote has been successfully submitted!");
      } catch (error) {
        console.error("Error submitting vote:", error);
        setMessage("Failed to submit your vote. Please try again.");
      }
    }
  };

  //helper function for updating userUnions
  const updateUnion = async () => {
    try {
      const userUnionsResponse = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/union/getUserUnions?userId=${userId}`)
      if (!userUnionsResponse.ok) {
        throw new Error("Response not okay")
      }
      const data = await userUnionsResponse.json()
      dispatch(setUserUnions({ unions: data.data }));

    } catch (error) {
      console.error("There was an error getting user unions... ", error)
    }
  }
  //Leave union call to api
  const leaveUnion = async () => {
    toggleUnionDropdown()
    if (role == "admin") {
      window.alert('You cannot leave the union as admin! More functionality will be added in the future')
    }
    try {
      const confirmed = window.confirm('Warning!!! You are about to leave the union. Press OK to continue')
      if (confirmed) {
        const response = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/union/leaveUnion`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, unionId })
          }
        )
        if (!response.ok) {
          throw new Error(`Response came back with status: ${response.status}`)
        }
        const data = await response.json()
        await updateUnion()
        router.push('/search')
      }
    } catch (error) {
      console.error("There was an error leaving union. ", error)
    }
  }
  //Delete union call to api
  const deleteUnion = async () => {
    toggleUnionDropdown()
    try {
      if (role == "admin") {
        const confirmed = window.confirm('Warning!!! You are about to delete the union. Press OK to continue')
        if (confirmed) {
          const response = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/union/deleteUnion`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId, unionId })
            }
          )
          if (!response.ok) {
            throw new Error(`Response came back with status: ${response.status}`)
          }
          const data = await response.json()
          window.alert(data.message)
          await updateUnion()
          router.push('/search')
        }
      }
    } catch (error) {
      console.error("There was an error leaving union. ", error)
    }
  }
  const handleChangeVote = async (workplaceId: string) => {
    if (previousVote) {
      try {
        // Step 1: Decrement the previous vote on the backend
        const response = await fetch(
          `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/polls/vote`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              workplaceId,
              userId, // Include userId for tracking the voter
              vote: previousVote,
              action: "decrement", // Decrement the previous vote
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to change vote.");
        }

        const data = await response.json();

        // Step 2: Update the state with new vote counts after decrement
        setVotes({ yes: data.yesCount, no: data.noCount });
        setTotalVotes(data.totalVotes);

        // Step 3: Reset state for new vote
        setSelectedOption(null);
        setPreviousVote(null);
        setVoted(false);
        setMessage("Your previous vote has been removed. Please cast a new vote.");
      } catch (error) {
        console.error("Error changing vote:", error);
        setMessage("Failed to change your vote. Please try again.");
      }
    }
  };

  const getPercentage = (option: "yes" | "no") => {
    return totalEmployees && totalEmployees > 0
      ? Math.round((votes[option] / totalEmployees) * 100)
      : 0;
  };

  const toggleDropdown = (workplaceId: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(workplaceId)
        ? prev.filter((id) => id !== workplaceId)
        : [...prev, workplaceId]
    );
  };

  const handleInviteWorkers = async () => {
    try {
      setIsGeneratingLink(true);
      const backendUrl = `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;
      const response = await fetch(`${backendUrl}/api/invites/generateInviteLink?unionId=${unionId}`);
      if (!response.ok) {
        throw new Error("Failed to generate invite link.");
      }
      const data = await response.json();
      const inviteLink = data.link;

      setInviteLink(inviteLink);
      setErrorMessage("");
    } catch (error) {
      console.error("Error generating invite link:", error);
      setErrorMessage("Failed to generate invite link. Please try again.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopyMessage("Invite link copied to clipboard!");
    setTimeout(() => {
      setCopyMessage("");
    }, 3000);
  };

  return (
    <div className="app-sidebar-container">
      <Sidebar className="app-sidebar">
        <SidebarContent>
          {/* Dynamic Union Name */}
          <div className="sidebar-union-header">
            <div className="union-title">
              <h1 className="union-name">{unionName} Union</h1>
              <button
                className="dropdown-toggle-button"
                ref={toggleButtonRef} // Attach the ref to the button
                onClick={toggleUnionDropdown} // Toggle dropdown on button click
                aria-label="Union Menu"
              >
                <img
                  src="/images/hamburger.png"
                  alt="Union Menu"
                  className="hamburger-icon"
                />
              </button>
            </div>
            <hr />

            {(isUnionDropdownOpen) && (
              <div className="union-dropdown-menu" ref={dropdownRef}>
                {
                  (role == "admin") ? (
                    <>
                      <div
                        className="union-dropdown-item"
                        onClick={() => setInviteModalOpen(true)}
                      >
                        Invite Workers
                      </div>
                      <div
                        className="union-dropdown-item"
                        onClick={() => handleOptionClick("/joinunionform", { unionId })}
                      >
                        Edit Invitation Form
                      </div>

                      <div
                        className="union-dropdown-item"
                        onClick={() => handleOptionClick("/union/manage-members")}
                      >
                        Manage Members
                      </div>
                      <hr />
                      <div
                        className="union-dropdown-item"
                        onClick={() => handleOptionClick("/union/create-poll")}
                      >
                        Create Poll
                      </div>
                      <div
                        className="union-dropdown-item"
                        onClick={() => handleOptionClick("/union/create-workplace")}
                      >
                        Create Workplace
                      </div>
                      <hr />
                      <div
                        className="union-dropdown-item"
                        onClick={() => handleOptionClick("/union/server-settings")}
                      >
                        Server Settings
                      </div>
                      <div
                        className="union-dropdown-item"
                        style={{ color: "red" }}
                        onClick={() => deleteUnion()}
                      >
                        Delete Union
                      </div>
                    </>)
                    :
                    <>
                      <div className="union-dropdown-menu" ref={dropdownRef}>
                        <div
                          className="union-dropdown-item"
                          onClick={() => setInviteModalOpen(true)}
                        >
                          Invite Workers
                        </div>
                        <div
                          className="union-dropdown-item"
                          onClick={() => handleOptionClick("/union/create-poll")}
                        >
                          Create Poll
                        </div>
                        <div
                          className="union-dropdown-item"
                          onClick={() => handleOptionClick("/union/create-workplace")}
                        >
                          Create Workplace
                        </div>
                        <hr />
                        <div
                          className="union-dropdown-item"
                          style={{ color: "red" }}
                          onClick={() => leaveUnion()}
                        >
                          Leave Union
                        </div>

                      </div></>
                }

              </div>
            )
            }
          </div>
          <div className="sidebar-divider"></div>

          {/* General Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="sidebar-group-label">General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats &&
                  chats.map((chat, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild>
                        <div
                          className="chat-item"
                          onClick={() =>
                            router.push(`/unions/${chat.unionId}/chat/${chat.id}`)
                          }
                        >
                          <span>{chat.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Workplaces Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="sidebar-group-label">Workplaces</SidebarGroupLabel>
            {loading && <p>Loading workplaces...</p>}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {workplaces.length === 0 && !loading && !error && (
              <p>No workplaces found for this union.</p>
            )}
            {workplaces.map((workplace) => (
              <div key={workplace.id}>
                <div
                  className="workplace-title"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => { toggleDropdown(workplace.id) }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="workplace-name">{workplace.workplaceName}</span>
                    {workplace.isUnionized && (
                      <div className="checkmark-container">
                        <img
                          className="checkmark-image"
                          src="/images/check-mark.png"
                          alt="Unionized"
                        />
                        <span className="tooltip-text">Is unionized</span>
                      </div>
                    )}
                  </div>
                  <span className="dropdown-toggle">{openDropdowns.includes(workplace.id) ? "▼" : "▶"}</span>
                </div>

                {openDropdowns.includes(workplace.id) && (
                  <SidebarMenu>
                    <SidebarMenuItem>
                      {workplace.chats &&
                        workplace.chats.map((chat, i) => (
                          <SidebarMenuItem key={i}>
                            <SidebarMenuButton asChild>
                              <div
                                className="chat-item"
                                onClick={() =>
                                  router.push(`/unions/${chat.unionId}/chat/${chat.id}`)
                                }
                              >
                                <span>{chat.name}</span>
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}

                      {!workplace.isUnionized && (
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <div
                              className="poll-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTotalEmployees(workplace.employeeCount || 0);
                                setPollModalOpen(true);
                                openPollModal(workplace.id);
                              }}
                            >
                              {workplace.workplaceName} Unionize Poll
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenuItem>
                  </SidebarMenu>
                )}
              </div>
            ))}
          </SidebarGroup>

          {/* Find More Workplaces */}
          <div className="sidebar-footer">
            <a href="/find-workplaces" className="find-workplaces-link">
              Find More Workplaces
            </a>
          </div>
        </SidebarContent>
      </Sidebar >

      {/* Poll Modal */}
      <Modal Modal isOpen={isPollModalOpen} onClose={() => setPollModalOpen(false)
      }>
        <div
          className="modal-overlay"
          onClick={() => setPollModalOpen(false)}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setPollModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <h1 className="poll-question">Should we apply for unionization now?</h1>
            {/* Automatically fetch and display total employees */}
            <div className="employee-input">
              <label htmlFor="employee-count">Total Number of Employees:</label>
              <input
                id="employee-count"
                type="number"
                value={totalEmployees || ""}
                readOnly
                placeholder="Fetching employee count..."
                style={{
                  backgroundColor: "#e0e0e0",
                  cursor: "not-allowed",
                }}
              />
            </div>
            <ul className="poll-options">
              {["yes", "no"].map((option) => (
                <li
                  key={option}
                  className={`poll-option ${selectedOption === option ? "selected" : ""}`}
                  onClick={() => !voted && setSelectedOption(option)}
                  style={{
                    pointerEvents: voted ? "none" : "auto",
                    backgroundColor: voted
                      ? option === selectedOption
                        ? "#61a653"
                        : "#2d2e2d"
                      : "#f5f5f5",
                    color: voted ? "#fff" : "#666b62",
                    fontWeight: "bold",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    margin: "10px 0",
                    cursor: !voted ? "pointer" : "default",
                  }}
                >
                  <span>{option.toUpperCase()}</span>
                  {voted ? (
                    <span className="percentage">
                      {votes[option as "yes" | "no"]} Votes ({getPercentage(option as "yes" | "no")}%)
                    </span>
                  ) : (
                    <div className={`radio-button ${selectedOption === option ? "checked" : ""}`}></div>
                  )}
                </li>
              ))}
            </ul>
            {voted ? (
              <div className="poll-results">
                {message && (
                  <p className={message.includes("need") ? "error-message" : "success-message"}>
                    {message}
                  </p>
                )}
                <button
                  className="change-vote-button"
                  onClick={() => {
                    if (selectedWorkplace) {
                      console.log("Changing vote for:", selectedWorkplace.id);
                      handleChangeVote(selectedWorkplace.id);
                    }
                  }}
                >
                  Change Vote
                </button>
              </div>
            ) : (
              <button
                className="vote-button"
                onClick={() => {
                  if (selectedWorkplace) {
                    console.log("Voting for:", selectedWorkplace.id);
                    handleVote();
                  }
                }}
                disabled={!selectedOption || !totalEmployees}
              >
                Vote
              </button>
            )}
          </div>
        </div>
      </Modal >

      {isInviteModalOpen && (
        <Modal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)}>
          <div
            className="invite-modal-overlay"
            onClick={() => setInviteModalOpen(false)}
          >
            <div className="invite-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
              {!inviteLink ? (
                <div className="invite-workers-header">
                  <h2>Invite Workers</h2>
                  <button
                    className="invite-button"
                    onClick={handleInviteWorkers}
                    disabled={isGeneratingLink}
                  >
                    {isGeneratingLink ? "Generating..." : "Generate Invite Link"}
                  </button>
                </div>
              ) : (
                <div className="invite-link-header">
                  <h2>Generated Link</h2>
                  <p className="invite-link-label">Invitation Link:</p>
                  <div className="invite-link-container">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="invite-link-input"
                    />
                    <button className="copy-link-button" onClick={handleCopyLink}>
                      Copy
                    </button>
                  </div>
                  {copyMessage && <p className="copy-success-message">{copyMessage}</p>}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div >
  );
}
