'use client';

import React, { useRef } from 'react';
import { MdPlayCircle } from 'react-icons/md';
import { ClientModal } from '../client/ClientModal';

const VideoModal = () => {
  const videoRef = useRef<HTMLVideoElement>();

  const toggle = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.paused ? vid.play() : vid.pause();
    }
  };

  return (
    <ClientModal
      btnContent={<></>}
      lg
      onClose={() => videoRef.current && videoRef.current.pause()}
      btn={
        <button
          onClick={toggle}
          className="btn btn-circle border btn-secondary animate-pulse"
        >
          <MdPlayCircle className="text-4xl" />
        </button>
      }
    >
      <div
        onClick={toggle}
        className="w-full h-full flex justify-center items-center rounded overflow-hidden"
      >
        <video
          ref={videoRef as any}
          src="/assets/videos/shaka.mp4"
          poster="/assets/imgs/shaka-banner.jpeg"
          className="h-auto w-full rounded"
          controls={false}
          loop={true}
        />
      </div>
    </ClientModal>
  );
};

export default VideoModal;
