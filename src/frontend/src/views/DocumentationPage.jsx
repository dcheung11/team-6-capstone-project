import NavBar from "../components/NavBar"
import React from 'react';
import { Container } from "@mui/material";
import inviteplayers1 from "../assets/documentation/inviteplayers1.png";
import inviteplayers2 from "../assets/documentation/inviteplayers2.png"
import inviteplayers3 from "../assets/documentation/inviteplayers3.png"
import inviteplayers4 from "../assets/documentation/inviteplayers4.png"
import inviteplayers5 from "../assets/documentation/inviteplayers5.png"
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
import reschedule4 from "../assets/documentation/reschedule4.png"
import reschedule5 from "../assets/documentation/reschedule5.png"
import reschedule6 from "../assets/documentation/reschedule6.png"
import reschedule7 from "../assets/documentation/reschedule7.png"
import reschedule8 from "../assets/documentation/reschedule8.png"
import reschedule9 from "../assets/documentation/reschedule9.png"
import captains1 from "../assets/documentation/captains1.png"
import captains2 from "../assets/documentation/captains2.png"
import contacts1 from "../assets/documentation/contacts1.png"
import contacts2 from "../assets/documentation/contacts2.png"

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
        <li>
            <a href="#contact-information" className="text-blue-600 hover:underline">Contact Information</a>
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
            <a href="#request-to-reschedule-games" className="text-blue-600 hover:underline">Request to Reschedule Games</a>
        </li>
        <li>
            <a href="#respond-to-reschedule-requests" className="text-blue-600 hover:underline">Respond to Reschedule Requests</a>
        </li>
        <li>
            <a href="#captain-contacts" className="text-blue-600 hover:underline">Captain Contacts</a>
        </li>
    </ul>
</div>


                </div>

                {/* Documentation Content */}
                <hr style={{ border: "1px solid #000", margin: "20px 0 80px 0" }}/>

                <h3 id="players" className="text-3xl font-bold mb-4" style={{ textDecoration: "underline", textAlign: "center" }} >Players</h3>   

<h5 id="register-team" className="text-4xl font-bold mb-4">Register Team</h5>
    <p>Navigate to the home page to register your team for the desired season.</p>
    <p>The registering player will become the captain of their team. Keep in mind, accounts can only belong on one team.</p>
    <p>Ongoing seasons can also be viewed here.</p>
    <img 
        src={registerteam1} 
        alt="registerteam1" 
        className="w-full mb-4" 
        style={{ width: "70%", height: "auto", border: "4px solid black" }} 
    />

    {/* Divider Line */}
    <hr style={{ border: "1px solid #000", margin: "20px 0" }} />

<h5 id="accept-team-invite" className="text-4xl font-bold mb-4">Accept Team Invite</h5>
<p>Players can accept team invites by navigating to the profile page.</p>
    <img 
        src={acceptinvite1} 
        alt="acceptinvite1" 
        className="w-full mb-4" 
        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
    />
<p>You can see all team invitations here. Click "click to accept" to join the team. Each account can only be on one team per season.</p>
          <img 
        src={acceptinvite2} 
        alt="acceptinvite2" 
        className="w-full mb-4" 
        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
    />

 {/* Divider Line */}
 <hr style={{ border: "1px solid #000", margin: "20px 0" }}/>
 <h5 id="contact-information" className="text-4xl font-bold mb-4">Contact Information</h5>

<p>Navigate to the my team page.</p>
        <img 
                    src={contacts1} 
                    alt="contacts1" 
                    className="w-full mb-4" 
                    style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                />
<p>Scroll down. Here, the team roster includes the email contact for all your teammates.</p>
      <img 
                    src={contacts2} 
                    alt="contacts2" 
                    className="w-full mb-4" 
                    style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                />

    {/* Divider Line */}
    <hr style={{ border: "1px solid #000", margin: "20px 0 80px 0" }}/>

                <h3 id="captains" className="text-4xl font-bold mb-4" style={{ textDecoration: "underline", textAlign: "center" }}>Captains</h3>

                <h5 id="invite-players" className="text-4xl font-bold mb-4">Invite Players</h5>
                <p>Captains can invite players by navigating to the "invite players" button located on the myteam page.</p>
                    <img 
                        src={inviteplayers1} 
                        alt="inviteplayers1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                 <p>Click "invite players" to navigate to the list of players page.</p>
                        <img 
                        src={inviteplayers2} 
                        alt="inviteplayers2" 
                        className="w-full  mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                 <p>Click "invite to team" to invite the player.</p>
                        <img 
                        src={inviteplayers3} 
                        alt="inviteplayers3" 
                        className="w-full mb-4" 
                        style={{ width: "70%", height: "auto", border: "4px solid black" }} 
                    />
                 <p>Pending invitations will show as "invite sent."</p>
                                      <img 
                        src={inviteplayers4} 
                        alt="inviteplayers4" 
                        className="w-full mb-4" 
                        style={{ width: "70%", height: "auto", border: "4px solid black" }} 
                    />
                       <p>You can use the search bar to filter players by name or toggle the button to view all players in the league.</p>
                                      <img 
                        src={inviteplayers5} 
                        alt="inviteplayers5" 
                        className="w-full mb-4" 
                        style={{ width: "70%", height: "auto", border: "4px solid black" }} 
                    />

{/* Divider Line */}
<hr style={{ border: "1px solid #000", margin: "20px 0" }} />

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
                     <p>Fill out the score and click "submit" to submit the score.</p>
                                     <img 
                        src={submitscores3} 
                        alt="submitscores3" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                     <p>You can re-edit the score any time if needed to by clicking "edit."</p>
                     <p>We expect all teams to uphold integrity and report scores honestly and accurately.</p>
                                     <img 
                        src={submitscores4} 
                        alt="submitscores4" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />

{/* Divider Line */}
<hr style={{ border: "1px solid #000", margin: "20px 0" }} />

            <h5 id="request-to-reschedule-games" className="text-4xl font-bold mb-4">Request to Reschedule Games</h5>
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
                 <p>Click "reschedule."</p>
                  <img 
                        src={reschedule3} 
                        alt="reschedule3" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
                <p>Select any dates you would like to reschedule to (maroon = selected) and submit.</p>
                  <img 
                        src={reschedule4} 
                        alt="reschedule4" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />

    <hr style={{ border: "1px solid #000", margin: "20px 0" }} />

    <h5 id="respond-to-reschedule-requests" className="text-4xl font-bold mb-4">Respond to Reschedule Requests</h5>
        <p>The captain is responsible for responding to reschedule requests.</p>
        <p>Navigate to the my team page.</p>
                <img 
                        src={reschedule5} 
                        alt="reschedule1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
        <p>You will find reschedule requests in the scheduling notifications section of the page. Select a notification to read.</p>
                                  <img 
                        src={reschedule6} 
                        alt="reschedule1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
        <p>Here, we can see game date proposals from the other team.</p>
                                  <img 
                        src={reschedule7} 
                        alt="reschedule1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
        <p>You can agree to one of the game date proposals by clicking on a date and confirming.</p>
                                  <img 
                        src={reschedule8} 
                        alt="reschedule1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
        <p>You can also deny all game date proposals by selecting "none of these work."</p>
                                        <img 
                        src={reschedule9} 
                        alt="reschedule1" 
                        className="w-full mb-4" 
                        style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                    />
        
        <hr style={{ border: "1px solid #000", margin: "20px 0" }} />

<h5 id="captain-contacts" className="text-4xl font-bold mb-4">Captain Contacts</h5>
    <p>The captain is able to view the contact information of the captains of other teams.</p>
    <p>Navigate to the my team page.</p>
            <img 
                    src={captains1} 
                    alt="captains1" 
                    className="w-full mb-4" 
                    style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                />
    <p>Click "captain contacts". Here, you are able to access all contact information easily if ever needed.</p>
        <img 
                    src={captains2} 
                    alt="captains2" 
                    className="w-full mb-4" 
                    style={{ width: "51%", height: "auto", border: "4px solid black" }} 
                />
                    
            </Container>
        </div>
    );
}
