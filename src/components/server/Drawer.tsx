import React from 'react';

const Drawer = ({
  className,
  openTitle,
  content,
}: {
  className?: string;
  openTitle: React.ReactNode;
  content: React.ReactNode;
}) => {
  return (
    <div className={`drawer ${className ?? ''}`}>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          {openTitle}
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
