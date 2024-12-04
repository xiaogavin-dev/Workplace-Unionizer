import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
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
import './app-sidebar.css';

export function AppSidebar({ chats }: { chats: object[] }) {
  const [isPollModalOpen, setPollModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [previousVote, setPreviousVote] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const router = useRouter();

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

  return (
    <div>
      <Sidebar className="mt-20 ml-[90px] transition ease-in-out">
        <SidebarContent>
          {/* Polls Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Polls</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div onClick={() => setPollModalOpen(true)}>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>Unionize Poll</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Chats Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats &&
                  chats.map((chat, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild>
                        <div
                          onClick={() =>
                            router.push(`/unions/${chat.unionId}/chat/${chat.id}`)
                          }
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span>{chat.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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
