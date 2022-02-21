import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
    return (
        <div className="footer">
            <div className="joinPanel">
                <div className="content1">
                    <img src="/image/twitter.png" alt="" />
                    <div className="text">Don’t miss out on all the posts here</div>
                    <div className="joinBtn">Join</div>
                </div>
                <img src="/image/img16.png" alt="" />
            </div>

            <div className="contactPanel">
                <div className="content1">
                    <img src="/image/footer_logo.png" alt="" />
                    <div className="contactInfo">
                        <a href="https://twitter.com/BUBBLEXCOM"><img src="/image/twitter1.png" alt="" /></a>
                        <a href="https://www.facebook.com/BubbleX-106465745305274/"><img src="/image/facebook.png" alt="" /></a>
                        <a href="https://www.instagram.com/bubblexcom__/"><img src="/image/instagram.png" alt=""/></a>
                    </div>
                </div>
                <div className="content2">
                    <div className="aboutPanel">
                        <div className="content1">
                            <Link to="/About">About</Link>
                            <Link to="/Roadmap">Roadmap</Link>
                            <Link to="/Faq" >Faq</Link>
                        </div>
                        <div className="content1">
                            <Link to="/SlamWallet">SlamWallet</Link>
                            <Link to="/SlamNFT" >SlamNFT</Link>
                        </div>
                    </div>
                    <div className="content2">
                        <div >Contact Us</div>
                        <Link to="mailto:slam@mail.com" >slam@mail.com</Link>
                        <div>Ask a Question</div>
                        <Link to="mailto:slam_support@mail.com">slam_support@mail.com</Link>
                    </div>
                </div>
            </div>
            <div className="version">2021 CryptoBubbles. All rights reserved.</div>
        </div>
    )
}