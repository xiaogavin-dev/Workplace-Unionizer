import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import useWorkplaces from "@/hooks/useWorkplaces";
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
}: {
  chats: object[];
  unionName: string;
  unionId: string;
}) {
  console.log("Union ID:", unionId);
  const [isPollModalOpen, setPollModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [previousVote, setPreviousVote] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isUnionDropdownOpen, setUnionDropdownOpen] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const toggleUnionDropdown = () => {
    setUnionDropdownOpen((prevState) => !prevState); // Toggle the dropdown state
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown only if the click is outside both the dropdown and the toggle button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setUnionDropdownOpen(false);
      }
    };

    // Attach mousedown listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (path: string) => {
    setUnionDropdownOpen(false); // Close dropdown after clicking an option
    router.push(path);
  };

  // Use the custom hook to fetch workplaces
  const { workplaces, loading, error } = useWorkplaces(unionId);

  const handleVote = () => {
    if (selectedOption && totalEmployees) {
      const newVotes = { ...votes };
      newVotes[selectedOption] += 1;
      const newTotalVotes = totalVotes + 1;
      const yesVotes = newVotes["yes"];
      const requiredVotes = Math.ceil(totalEmployees * 0.3 - yesVotes);

      setVotes(newVotes);
      setTotalVotes(newTotalVotes);
      setVoted(true);
      setPreviousVote(selectedOption);

      if (yesVotes / totalEmployees >= 0.3) {
        setMessage(
          `${Math.round(
            (yesVotes / totalEmployees) * 100
          )}% of employees have voted 'Yes'. You can start the unionization process!`
        );
      } else {
        setMessage(
          `You need ${requiredVotes} more vote${requiredVotes > 1 ? "s" : ""} to start the unionization process.`
        );
      }
    }
  };

  const handleChangeVote = () => {
    if (previousVote) {
      const newVotes = { ...votes };

      newVotes[previousVote] -= 1;

      const newTotalVotes = totalVotes - 1;

      setVotes(newVotes);
      setTotalVotes(newTotalVotes);
      setSelectedOption(null);
      setPreviousVote(null);
      setVoted(false);
      setMessage("");
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
                  src="/images/hamburger.png" // Replace with your actual image path
                  alt="Union Menu"
                  className="hamburger-icon"
                />
              </button>
            </div>
            <hr />
            {isUnionDropdownOpen && (
              <div className="union-dropdown-menu" ref={dropdownRef}>
                <div
                  className="union-dropdown-item"
                  onClick={() => handleOptionClick("/union/invite-workers")}
                >
                  Invite Workers
                </div>
                <div
                  className="union-dropdown-item"
                  onClick={() => handleOptionClick("/union/edit-invitation-form")}
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
              </div>
            )}
          </div>
          <div className="sidebar-divider"></div>

          {/* Polls Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="sidebar-group-label">Polls</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="poll-button" onClick={() => setPollModalOpen(true)}>
                      Unionize Poll
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Chats Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="sidebar-group-label">Chats</SidebarGroupLabel>
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
                  onClick={() => toggleDropdown(workplace.id)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleDropdown(workplace.id)}
                >
                  <span className="workplace-name">{workplace.workplaceName}</span>
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
      </Sidebar>

      {/* Poll Modal */}
      <Modal isOpen={isPollModalOpen} onClose={() => setPollModalOpen(false)}>
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
            <div className="employee-input">
              <label htmlFor="employee-count">Total Number of Employees:</label>
              <input
                id="employee-count"
                type="number"
                value={totalEmployees || ""}
                onChange={(e) => setTotalEmployees(Number(e.target.value))}
                placeholder="total"
                disabled={voted}
                style={{
                  backgroundColor: voted ? "#e0e0e0" : "white",
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
                  onClick={handleChangeVote}
                >
                  Change Vote
                </button>
              </div>
            ) : (
              <button
                className="vote-button"
                onClick={handleVote}
                disabled={!selectedOption || !totalEmployees}
              >
                Vote
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
