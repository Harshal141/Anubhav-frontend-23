import React, { useMemo, useState } from 'react';
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { WobbleCard } from '../components/Tooltip/wobble';
import { AnimatePresence, motion } from 'framer-motion'; // Import motion from framer-motion

const DevTeamMember = React.memo(({ name, platform, imageSrc, githubId, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
            delay: index * 0.05,
            duration: 0.3,
            ease: [0.33, 1, 0.68, 1],
        }}
        className='overflow-hidden'
    >
        <WobbleCard containerClassName="min-h-[300px]">
            <div className="flex flex-col items-start ">
                <img
                    src={imageSrc}
                    alt={`${name}'s avatar`}
                    className="w-[300px] min-w-[150px] select-none object-cover h-[300px] rounded-[8px]"
                    loading="lazy"
                />
                <h3 className=" text-[#212121] text-[24px] font-medium leading-[125%] text-left">{name}</h3>
                <a
                    href={`https://github.com/${githubId.replace(' ', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#515151] font-[400] z-10 hover:underline text-[16px]"
                >
                    {platform}
                </a>
            </div>
        </WobbleCard>
    </motion.div>
));


const DevTeam = () => {
    const [activeTeam, setActiveTeam] = useState('current'); // Holds 'current' or 'firstGen'

    const teamSection = [
        { label: 'Current Team', key: 'current' },
        { label: 'First Gen', key: 'firstGen' }
    ];


    const teamMembers = useMemo(
        () => ({
            current: [
                {
                    id: 1,
                    name: 'Harshal Patil',
                    platform: 'GitHub',
                    imageSrc: '/dev/harshal.jpg',
                    githubId: 'Harshal141'
                },
                {
                    id: 2,
                    name: 'Nikhil Dhariwal',
                    platform: 'GitHub',
                    imageSrc: '/dev/nikhil.jpg',
                    githubId: '404nikhil'
                },
                {
                    id: 3,
                    name: 'Lokendra Kushwah',
                    platform: 'GitHub',
                    imageSrc: '/dev/loki.png',
                    githubId: 'Lokendrakushwah12'
                },
                {
                    id: 4,
                    name: 'Gourav',
                    platform: 'GitHub',
                    imageSrc: '/dev/gourav.jpg',
                    githubId: 'Gourav2609'
                },
                {
                    id: 5,
                    name: 'Darshan Garad',
                    platform: 'GitHub',
                    imageSrc: '/dev/darshan.jpeg',
                    githubId: 'darkars33'
                },
            ],
            firstGen: [
                {
                    id: 11,
                    name: 'Arpit kr Mishra',
                    platform: 'GitHub',
                    imageSrc: '/dev/arp.jpg',
                    githubId: 'arkumish'
                },
                {
                    id: 12,
                    name: 'Akshay Sharma',
                    platform: 'GitHub',
                    imageSrc: '/dev/aks.jpg',
                    githubId: 'AkshaySharma008'
                },
                {
                    id: 13,
                    name: 'Satya Prakash',
                    platform: 'GitHub',
                    imageSrc: '/dev/sat.jpeg',
                    githubId: 'satya9500'
                },
                {
                    id: 14,
                    name: 'Akash Saxena',
                    platform: 'GitHub',
                    imageSrc: '/dev/aksx.jpg',
                    githubId: 'Akashsaxena2308'
                },
                {
                    id: 15,
                    name: 'Rishabh Rathore',
                    platform: 'GitHub',
                    imageSrc: '/dev/rrb.jpg',
                    githubId: 'xerycks'
                }
            ],
        }),
        []
    );

    return (
        <>
            <Navbar />
            <div className="flex flex-col mx-auto min-h-screen">
                <div className="flex-grow overflow-y-auto max-w-7xl mx-auto py-16 pt-24 px-4 sm:px-6 lg:px-6 text-center">
                    <h2 className="text-4xl font-[600] mb-4">Dev Team</h2>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {teamSection.map((section) => (
                            <div
                                key={section.key}
                                className={`relative cursor-pointer flex justify-center items-center gap-1 px-3 py-1`}
                                onClick={() => setActiveTeam(section.key)}
                            >
                                {section.label}
                                <div className="flex items-center justify-center w-[24px] h-[24px]">
                                    <AnimatePresence>
                                        {activeTeam === section.key && (
                                            <motion.svg
                                                key="icon"
                                                initial={{ opacity: 0, scale: '50%' }}
                                                animate={{ opacity: 1, scale: '100%' }}
                                                exit={{ opacity: 0, scale: '50%' }}
                                                transition={{ type: 'spring', duration: 0.4 }}
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5.625 12L9.87 16.245L18.375 7.755"
                                                    stroke="#414141"
                                                    strokeWidth="2.25"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </motion.svg>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <AnimatePresence>
                                    {activeTeam === section.key && (
                                        <motion.span
                                            layoutId="tab"
                                            transition={{ type: 'spring', duration: 0.4 }}
                                            className="absolute inset-0 z-[-10] rounded-full bg-white border border-[#e5e7eb]"
                                        ></motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-wrap justify-center gap-12'>
                        {teamMembers[activeTeam].map((member, index) => (
                            <DevTeamMember index={index} key={member.id} {...member} />
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default DevTeam;
