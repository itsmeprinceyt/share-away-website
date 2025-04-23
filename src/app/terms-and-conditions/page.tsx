'use client';
import React from 'react';
import Navbar from '../(components)/Navbar';
import PageWrapperNormal_Top from '../(components)/PageWrapperNormalTop';
import Link from 'next/link';
import Image from 'next/image';

const TermsAndConditions = () => {
    return (
        <PageWrapperNormal_Top>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 mt-24 mb-24 flex flex-col justify-between items-center gap-6">
                <Image
                    className="w-[250px] h-[250px] hover:scale-110 transition-all duration-300"
                    src={'/logo/ShareAway5-png.png'}
                    alt="Home"
                    width={500}
                    height={500}
                />

                <div className="text-center max-[350px]:text-xl text-2xl font-extralight antialiased text-pink-500 rounded-xl px-5 py-1 text-shadow-lg/20 text-shadow-pink-500">
                    Terms and Conditions
                </div>

                <div className="text-left max-[350px]:text-sm text-base font-normal text-pink-800 space-y-4 p-2">
                    <p>
                        <strong>Last Updated:</strong> 22-04-2025
                    </p>

                    <p>
                        Welcome to Share Away! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using the platform.
                    </p>

                    <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
                    <p>
                        By using Share Away, you agree to these Terms and Conditions. If you do not agree with any part of the terms, please do not use the platform.
                    </p>

                    <h3 className="font-semibold text-lg">2. User Responsibilities</h3>
                    <ul className="list-disc pl-5">
                        <li>No Sensitive or Harmful Content: You agree not to post any content that is sexually explicit, violent, hateful, or discriminatory in nature. Any content that may cause harm or distress to other users, including but not limited to explicit material, personal attacks, or harmful links, will be immediately banned.</li>
                        <li>No Harmful Links or Malware: You agree not to share any links that lead to harmful, malicious, or illegal websites, including those that could harm other users’ devices or privacy.</li>
                        <li>Respect and Kindness: Please treat others with respect. shareAway is a platform for healthy communication, and harassment, bullying, or hate speech will not be tolerated.</li>
                    </ul>

                    <h3 className="font-semibold text-lg">3. User Conduct</h3>
                    <p>You are prohibited from:</p>
                    <ul className="list-disc pl-5">
                        <li>Using the platform for any illegal or unauthorized purposes.</li>
                        <li>Impersonating others or misrepresenting your identity.</li>
                        <li>Attempting to gain unauthorized access to the platform or other user&apos;s accounts.</li>
                    </ul>

                    <h3 className="font-semibold text-lg">4. Content Moderation</h3>
                    <p>
                        We reserve the right to monitor and review content posted on the platform. If your post violates any of our guidelines or Terms, it may be removed, and you may face a temporary or permanent ban from the platform.
                    </p>

                    <h3 className="font-semibold text-lg">5. Account Suspension and Bans</h3>
                    <p>
                        We reserve the right to suspend or terminate your account if you engage in activities that violate our Terms and Conditions. This includes but is not limited to:
                    </p>
                    <ul className="list-disc pl-5">
                        <li>Posting harmful, offensive, or illegal content.</li>
                        <li>Sharing misleading information or engaging in spammy behavior.</li>
                    </ul>

                    <h3 className="font-semibold text-lg">6. Privacy</h3>
                    <p>Your privacy is important to us. Please refer to our Privacy Policy to learn more about how we collect, use, and protect your personal information.</p>

                    <h3 className="font-semibold text-lg">7. Intellectual Property</h3>
                    <p>
                        All content on Share Away, is the property of Share Away or its content creators and is protected by copyright laws. You may not use or reproduce any content without proper permission.
                    </p>

                    <h3 className="font-semibold text-lg">8. Changes to Terms</h3>
                    <p>
                        We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and the &quot;Last Updated&quot; date will be revised accordingly. Continued use of the platform after changes are made will be considered acceptance of those changes.
                    </p>

                    <h3 className="font-semibold text-lg">9. Limitation of Liability</h3>
                    <p>
                        Share Away is not responsible for any content posted by users or for any direct or indirect damages resulting from the use of the platform. Use of the platform is at your own risk.
                    </p>

                    <h3 className="font-semibold text-lg">10. Contact Us</h3>
                    <p>If you have any questions or concerns regarding these Terms and Conditions, please contact us through any means provided in the: <Link href="/contact" className="underline animate-pulse">Contact Page</Link></p>
                </div>
            </div>
        </PageWrapperNormal_Top>
    );
};

export default TermsAndConditions;
