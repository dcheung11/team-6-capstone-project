import NavBar from "../components/NavBar"
import React from 'react';
import { Container } from "@mui/material";
import Map from "../assets/Map.png";

// InfoPage: Displays a page with information about the league, including rules,
// registration, and contact information.
// Information was migrated from the old GSA website.
export default function InfoPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <NavBar />
            <Container maxWidth="md" sx={{ py: 4 }} className="text-center">
                <h1 className="text-4xl font-bold mb-4">Field Locations</h1>
                <img 
                    src={Map} 
                    alt="McMaster University Map" 
                    className="w-full rounded-lg shadow-lg hover:opacity-80 transition-opacity mb-4" 
                />
                <p className="text-lg text-gray-600">
                    Explore the <a 
                        href="https://discover.mcmaster.ca/map/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block mb-4 text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        McMaster Map
                    </a> for more details.
                </p>

                <h1 className="text-4xl font-bold mb-4">League Rules</h1>
                <a 
                    href="/Rules.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mb-4 text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                    League Specific Rules
                </a>
                <p className="text-lg text-gray-600">
                    We are using the USSSA standard with the addition that the following bats are also banned:
                </p>
                <ul className="list-disc pl-5 text-lg text-gray-600">
                    <li>Easton SCX2 Synergy</li>
                    <li>Easton SCX22 Synergy 2</li>
                </ul>
                
                <p> Also, please check the following link for a list of certified bats (Look for Approved Bats in top right menu): 
                </p>
                <a 
                    href="https://nsacanada.ca/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mb-4 text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">NSA Bat Certification</a> 

                <h1 className="text-4xl font-bold mb-4">Parking</h1>
                <a 
                    href="/Parking.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mb-4 text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">HONK Parking QR code</a> 

                <h1 className="text-4xl font-bold mb-4">Poster</h1>
                <a 
                    href="/Poster.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mb-4 text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">Poster</a> 

                <h1 className="text-4xl font-bold mb-4">Acknowledgements</h1>

                <p>
                    The league would like to acknowledge the following contributions to the league in the past few years:
                </p>
                <p>
                    The University and in particular John Abrahams and the parking authority for the erection of lighting on field 3 in 1999. The league could not have continued on its current scale without these lights. 
                </p>
                <p>
                    Mary Keyes - Associate Vice-President (Student Affairs) for the funding of the very successful safety-fencing project last year (1999). 
                </p>
                <p>
                    The MUFF fund committee for supplying the funds to purchase an infield grooming machine for the league. 
                </p>
                <p>
                    To Mary Keyes, Fred Hall, and the Office of Student Affairs for the financing of field renovations during the summer of 2002. Please refer to the links to photos below for images of the result.
                </p>
                <p>
                    The Department of Physics and Astronomy for tolerating the time I (Andy Duncan) spent on it. The level of organization (such that exists) would not be possible without this backing.
                </p>
                <p>
                    Andy Duncan (Mixed League Commissioner)<br />
                    Curt Keckamen (Mixed League Commissioner)
                </p>
                </Container>
        </div>
    );
}
