import React, { useState, useEffect, useRef } from 'react';
import BackButton from '../components/backbutton';
import mixpanel from 'mixpanel-browser';
import { Link } from 'react-router-dom';

export default function Privacy() {

	const isFirstRender = useRef(true)
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			mixpanel.track_pageview();
			return;
		}
	}, [])

	return (
		<main>
			<div className="mainPadding">
				<div className="mainWrapper">
					<Link to="/"><BackButton /></Link>
					<h2>Privacy Policy for PlaylistGen.com</h2>
					<p>Effective Date: July 23, 2023</p>
					<p>In this Privacy Policy (“Policy”), we describe how PlaylistGen.com (“PlaylistGen,” “we,” or “us”) collects, uses, and discloses information that we obtain about visitors to our website https://www.playlistgen.com (the “Site”) and the services available through our Site (collectively, the “Services”).</p>
					<p>By visiting the Site, or using any of our Services, you agree that your personal information will be handled as described in this Policy. Your use of our Site or Services, and any dispute over privacy, is subject to this Policy and our Terms of Service, including its applicable limitations on damages and the resolution of disputes. Our Terms of Service are incorporated by reference into this Policy.</p>
					<h3>The Information We Collect About You.</h3>
					<p>We collect information about you directly from you and from third parties, and automatically through your use of our Site or Services.</p>
					<h3>Information We Collect Directly From You. </h3>
					<p>The information we collect from you depends on how you use our Services. When you use PlaylistGen.com, you will be required to log in using your Spotify account. When you do so, you are not creating an account with PlaylistGen.com, but rather using our Services in an authenticated manner through Spotify. We collect the following information from your Spotify account:</p>
					<ul>
						<li>Spotify display name</li>
						<li>Spotify id</li>
						<li>Email address</li>
						<li>Paid status on Spotify (Spotify’s web playback doesn’t work if you’re free, so we need to tailor the experience to you in that case).</li>
						<li>Country</li>
					</ul>
					<p>We also may collect additional information from you if you choose to provide it.</p>
					<p>Information We Collect Automatically. We automatically collect information about your use of our Site. To the extent permitted by applicable law, we combine this information with other information we collect about you, including your personal information. Please see the section “Cookies and Other Tracking Mechanisms” below for more information</p>
					<p>We collect the following information when you visit our Site:</p>
					<ul>
						<li>Your browser type and operating system</li>
						<li>Web pages you view on the Site</li>
						<li>Links you click on the Site</li>
						<li>Your IP address</li>
						<li>Your geolocation</li>
						<li>The length of time you visit our Site and or use our Services</li>
						<li>The referring URL, or the webpage that led you to our Site</li>
						<li>Buttons that you click on</li>
					</ul>
					<h3>How We Use Your Information</h3>
					<p>We use your information, including your personal information, for the following purposes:</p>
					<ul>
						<li>To send you inquiries or questions about your experience.</li>
						<li>To provide our Services to you, including generating playlists on your behalf.</li>
						<li>To better understand how users access and use our Services, both on an aggregated and individualized basis.</li>
						<li>To administer surveys and questionnaires, such as for market research or satisfaction purposes.</li>
						<li>To comply with legal obligations, as part of our general business operations, and for other business administration purposes.</li>
						<li>Where we believe necessary to investigate, prevent or take action regarding illegal activities, suspected fraud, situations involving potential threats to the safety of any person, or violations of our Terms of Service or this Privacy Policy.</li>
					</ul>
					<h3>How We Share Your Information</h3>
					<p>We may disclose your information to third parties in the following circumstances:</p>
					<ul>
						<li>In Response to Legal Process. We may disclose your information to comply with the law, a judicial proceeding, court order, or other legal process, such as in response to a court order or a subpoena.</li>
						<li>To Protect Us and Others. We may disclose your information when we believe it is appropriate to do so to investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the safety of any person, violations of our Terms of Service or this Policy, or as evidence in litigation in which we are involved.</li>
					</ul>
					<h3>Our Use of Cookies and Other Tracking Mechanisms</h3>
					<p>We and our service providers use cookies and other tracking mechanisms to track information about your use of our Site or Services. We may combine this information with other personal information we collect from you (and our service providers may do so on our behalf). We use cookies for functional purposes only (i.e. to support the proper working of our Site and Services) and do not use cookies for advertising or profiling purposes.</p>
					<p>Cookies are alphanumeric identifiers that we transfer to your device’s hard drive through your web browser for record-keeping purposes. Some cookies allow us to make it easier for you to navigate our Site and Services, while others are used to enable a faster log-in process or to allow us to track your activities at our Site and Service. There are two types of cookies: session and persistent cookies.</p>
					<ul>
						<li>Session Cookies: Session cookies exist only during an online session. They disappear from your device when you close your browser or turn off your device. We use session cookies to allow our systems to uniquely identify you during a session or while you are logged into the Site and Services. This allows us to process your online transactions and requests and verify your identity, after you have logged in, as you move through our Site and Services.</li>
						<li>Persistent Cookies: Persistent cookies remain on your device after you have closed your browser or turned off your device. We use persistent cookies to track aggregate and statistical information about user activity.</li>
					</ul>
					<p>Disabling Cookies: Most web browsers automatically accept cookies, but if you prefer, you can change your browser options to block them in the future. The Help portion of the toolbar on most browsers will tell you how to prevent your computer from accepting new cookies, how to have the browser notify you when you receive a new cookie, or how to disable cookies altogether. Visitors to our Site and Services who disable cookies will be able to browse certain areas of the Site, but some features may not function properly.</p>
					<p>Third Party Analytics: We use automated devices and applications, such as mixpanel.com, to evaluate usage of our Site. We use these tools to help us improve our Site’s performance and user experiences.</p>
					<p>Do-Not-Track. Currently, our systems do not recognize browser “do-not-track” requests. You may, however, disable certain tracking as discussed in this section (e.g., by disabling cookies).</p>
					<h3>Third-Party Links</h3>
					<p>Our Site and Services may contain links to third-party websites. Any access to, and use of, such linked websites is not governed by this Policy, but instead is governed by the privacy policies of those third-party websites. We are not responsible for the information practices of such third-party websites.</p>
					<p>Security of My Personal Information</p>
					<p>We have implemented reasonable precautions to protect the information we collect from loss, misuse, and unauthorized access, disclosure, alteration, and destruction. Please be aware that despite our best efforts, no data security measures can guarantee security.</p>
					<p>You should take steps to protect against unauthorized access to your password, phone, and computer by, among other things, signing off after using a shared computer, choosing a robust password that nobody else knows or can easily guess, and keeping your log-in and password private. We are not responsible for any lost, stolen, or compromised passwords or for any activity on your account via unauthorized password activity.</p>
					<h3>What Choices Do I Have Regarding Use of My Personal Information?</h3>
					<p>We may send periodic promotional emails to you regarding membership benefits or related opportunities. You may opt-out of promotional emails by following the opt-out instructions contained in the email. Please note that it may take up to 10 business days for us to process opt-out requests. If you opt-out of receiving promotional emails, we may still send you emails about your account or any services you have requested or received from us.</p>
					<h3>Additional Privacy Rights under GDPR</h3>
					<p>Where the General Data Protection Regulation (“GDPR”) applies, in particular when you are accessing the Site from a country in the European Economic Area (“EEA”), you have the following rights, subject to applicable limitations:</p>
					<ul>
						<li>The right to access your personal information;</li>
						<li>The right to rectify the personal information we hold about you;</li>
						<li>The right to erase your personal information;</li>
						<li>The right to restrict our use of your personal information;</li>
						<li>The right to object to our use of your personal information;</li>
						<li>The right to receive your personal information in a usable electronic format and transmit it to a third party (also known as the right of data portability); and</li>
						<li>The right to lodge a complaint with your local data protection authority.</li>
					</ul>
					<p>If you would like to exercise any of these rights, you may do so submitting a request to us at chrisgallello [at] gmail.com, and including “GDPR Privacy Request” in the message box. Please understand, however, the rights enumerated above are not absolute in all cases.</p>
					<p>When you submit a GDPR request to us we may request additional information from you to confirm your identity.</p>
					<p>We will make best efforts to voluntarily provide the above rights to individuals outside of the EEA. We will endeavor to comply with GDPR requests within 45 days of receipt, but if we need additional time to handle the request we will notify you.</p>
					<h3>Children Under 13</h3>
					<p>Our Services are not designed for children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information from our systems.</p>
					<h3>Contact Us</h3>
					<p>If you have questions about the privacy aspects of our Services or would like to make a complaint, please contact us at chrisgallello [at] gmail.com.</p>
					<h3>Changes to this Policy</h3>
					<p>This Policy is current as of the Effective Date set forth above. We may change this Policy from time to time, so please be sure to check back periodically. We will post any changes to this Policy on our Site. If we make any changes to this Policy that materially affect our practices with regard to the personal information we have previously collected from you we will endeavor to provide you with notice in advance of such change by highlighting the change on our Site.</p>
				</div>
			</div>
		</main>
	);
}