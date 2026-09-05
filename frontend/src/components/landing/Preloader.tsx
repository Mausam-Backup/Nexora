export default function Preloader() {
  return (
  <div className="preloader">
    <div className="preloader__wrapper">
      <div className="prelaoder__speaner w-embed">
        <svg fill="none" viewBox="0 0 250 250" width="100%" height="100%">
          <path stroke="#fff" strokeWidth="8" strokeLinecap="round" d="M125 20c57.99 0 105 47.01 105 105s-47.01 105-105 105S20 182.99 20 125C20 67.023 66.988 20.022 124.96 20" className="svg-elem-1"></path>
        </svg>
      </div>
      <div className="preloader__logo w-embed">
        <svg fill="none" viewBox="0 0 26 19">
          <path fill="#7CB1FF" d="M1 4.557A3.5 3.5 0 0 1 4.556 1a3.497 3.497 0 0 1 3.556 3.557 3.499 3.499 0 0 1-3.556 3.555A3.498 3.498 0 0 1 1 4.557Z">
          </path>
          <path fill="#fff" stroke="#fff" strokeWidth=".2" d="M13.5 17.5V1.5h2.4l5.6 11.2V1.5H24v16h-2.4l-5.7-11.4v11.4h-2.4Z">
          </path>
        </svg>
      </div>
    </div>
  </div>
  );
}
