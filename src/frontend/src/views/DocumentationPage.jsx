import NavBar from "../components/NavBar"
import React from 'react';
import { Container } from "@mui/material";
import inviteplayers1 from "../assets/documentation/inviteplayers1.png";
import inviteplayers2 from "../assets/documentation/inviteplayers2.png"
import inviteplayers3 from "../assets/documentation/inviteplayers3.png"
import inviteplayers4 from "../assets/documentation/inviteplayers4.png"
import registerteam1 from "../assets/documentation/registerteam1.png"
import acceptinvite1 from "../assets/documentation/acceptinvite1.png"
import acceptinvite2 from "../assets/documentation/acceptinvite2.png"
import submitscores1 from "../assets/documentation/submitscores1.png"
import submitscores2 from "../assets/documentation/submitscores2.png"
import submitscores3 from "../assets/documentation/submitscores3.png"
import submitscores4 from "../assets/documentation/submitscores4.png"
import reschedule1 from "../assets/documentation/reschedule1.png"
import reschedule2 from "../assets/documentation/reschedule2.png"
import reschedule3 from "../assets/documentation/reschedule3.png"

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <NavBar />
            <Container maxWidth="md" sx={{ py: 4 }} className="text-center">
                <h1 className="text-4xl font-bold mb-4">Documentation</h1>

            {/* Table of Contents */}
            <div className="mb-6 p-4 bg-white shadow-lg rounded-lg w-full text-left">
                    <h2 className="text-2xl font-bold mb-2">Table of Contents</h2>
                    <div>

                    <h3 className="font-bold text-lg mt-4">Players</h3>
    <ul className="list-disc list-inside">
    <li>
            <a href="#register-team" className="text-blue-600 hover:underline">Register Team</a>
        </li>
        <li>
            <a href="#accept-team-invite" className="text-blue-600 hover:underline">Accept Team Invite</a>
        </li>
    </ul>

    <h3 className="font-bold text-lg mt-4">Captains</h3>
    <ul className="list-disc list-inside">
        <li>
            <a href="#invite-players" className="text-blue-600 hover:underline">Invite Players</a>
        </li>
        <li>
            <a href="#submit-scores" className="text-blue-600 hover:underline">Submit Scores</a>
        </li>
        <li>
            <a href="#reschedule-games" className="text-blue-600 hover:underline">Reschedule Games</a>
        </li>
    </ul>
</div>

                </div>

                <h3 id="players" className="text-4xl font-bold mb-4">Players</h3>   

<h5 id="register-team" className="text-4xl font-bold mb-4">Register Team</h5>
    <p>Navigate to the home page to register your team for the desired season.</p>
    <p>A player can only be the captain for one team.</p>
    <img 
        src={registerteam1} 
        alt="registerteam1" 
        className="w-full mb-4" 
        style={{ width: "70%", height: "auto", border: "4px solid black" }} 
    />

<h5 id="accept-team-invite" className="text-4xl font-bold mb-4">Accept Team Invite</h5>
<p>Players can accept team invites by navigating to the profile page.</p>
    <img 
        src={acceptinvite1} 
        alt="acceptinvite1" 
        className="w-full mb-4" 
        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
    />
          <img 
        src={acceptinvite2} 
        alt="acceptinvite2" 
        className="w-full mb-4" 
        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
    />



                <h3 id="captains" className="text-4xl font-bold mb-4">Captains</h3>

                <h5 id="invite-players" className="text-4xl font-bold mb-4">Invite Players</h5>
                <p>Captains can invite players by navigating to the "invite players" button located on the myteam page</p>
                    <img 
                        src={inviteplayers1} 
                        alt="inviteplayers1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                        <img 
                        src={inviteplayers2} 
                        alt="inviteplayers2" 
                        className="w-full  mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                        <img 
                        src={inviteplayers3} 
                        alt="inviteplayers3" 
                        className="w-full mb-4" 
                        style={{ width: "70%", height: "auto", border: "4px solid black" }} 
                    />
                                      <img 
                        src={inviteplayers4} 
                        alt="inviteplayers4" 
                        className="w-full mb-4" 
                        style={{ width: "70%", height: "auto", border: "4px solid black" }} 
                    />

                <h5 id="submit-scores" className="text-4xl font-bold mb-4">Submit Scores</h5>
                <p>The captain of the winning team is responsible for submitting the game score.</p>
                <p>Only the captain can submit game scores by navigating to the myteam page and scrolling down to the schedule.</p>
                <img 
                        src={submitscores1} 
                        alt="submitscores1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                    <img 
                        src={submitscores2} 
                        alt="submitscores3" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                     <p>Once the score is submitted, only the commissioner can make changes.</p>
                                     <img 
                        src={submitscores3} 
                        alt="submitscores3" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                                     <img 
                        src={submitscores4} 
                        alt="submitscores4" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />

            <h5 id="reschedule-games" className="text-4xl font-bold mb-4">Reschedule Games</h5>
                <p>The captain is responsible for rescheduling games.</p>
                <p>Navigate to the schedule page.</p>
                <img 
                        src={reschedule1} 
                        alt="reschedule1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                <p>Click "next" to see the available reschedule slots for next week.</p>
                  <img 
                        src={reschedule2} 
                        alt="reschedule2" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                 <p>Click "reschedule" for the desired date.</p>
                  <img 
                        src={reschedule3} 
                        alt="reschedule3" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
            </Container>
        </div>
    );
}
