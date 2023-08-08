import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="footer p-10 pb-14 bg-base-200 text-base-content">
      <div>
        <Image alt="Shaka Logo" width={100} height={50} src={'/logo.png'} />
        <p>
          <span className="font-bold text-lg">Shaka E-Commerce</span>
          <br />
          Providing reliable goods & services.
        </p>
      </div>
      <div>
        <span className="footer-title">Services</span>
        <a className="link link-hover">E-commerce</a>
        <a className="link link-hover">Advertisement</a>
        <a className="link link-hover">Marketing</a>
      </div>
      <div>
        <span className="footer-title">Address</span>
        <a className="link link-hover">Kigali, Rwanda</a>
        <a className="link link-hover">
          Address: KN 48 Street, Kigali, Makuza plaza
        </a>
        <a className="link link-hover"> Floor: 3rd floor - Room: F3-13</a>
        <a className="link link-hover">Call: (+250) 786 265 766</a>
        <a className="link link-hover">Email: shaka.encore@gmail.com</a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </div>
    </footer>
  );
};

export default Footer;
