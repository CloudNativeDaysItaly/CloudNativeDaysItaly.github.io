import Link from "next/link";
import './PersonCard.css';

const PersonCard = ({ person, link }) => (
    <Link href={link} className="person-card-link group">
        <div className="person-card">
            <div className="person-card-background"></div>
            <div className="person-card-content">

                <div className="person-card-image-wrapper **relative**">
                    <img src={person.image} alt={person.name} className="person-card-image" />

                    {person.level && (
                        <div className={`absolute top-2 left-2 rounded-full px-3 py-1 text-xs font-semibold uppercase shadow-md ${
                            person.level === "core"
                                ? "bg-red-600 text-white" 
                                : "bg-blue-400 text-black"
                        }`}>
                            {person.level === "core" ? "Core Organizer" : "Organizer"}
                        </div>
                    )}

                </div>

                <div className="person-card-info">
                    <h3 className="person-card-name">{person.name}</h3>
                    <p className="person-card-role">{person.role} @{person.company}</p>
                    {person.communityRole && (
                        <p className="person-card-community-role">{person.communityRole}</p>
                    )}
                </div>
            </div>
        </div>
    </Link>
);

export default PersonCard;
