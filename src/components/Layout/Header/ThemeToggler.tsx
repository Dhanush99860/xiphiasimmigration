"use client";

import { useTheme } from "next-themes";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-lg 
                 text-body-color dark:text-white 
                 transition-colors duration-300 
                 focus-visible:outline-none 
                 focus-visible:ring-2 focus-visible:ring-primary 
                 focus-visible:ring-offset-2 
                 focus-visible:ring-offset-white dark:focus-visible:ring-offset-darkmode"
    >
      {/* Sun (only visible in dark mode) */}
      <svg
        viewBox="0 0 16 16"
        className="hidden h-[22px] w-[22px] fill-current dark:block"
        aria-hidden="true"
      >
        <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z" />
      </svg>

      {/* Moon (only visible in light mode) */}
      <svg
        viewBox="0 0 23 23"
        className="h-[30px] w-[30px] fill-current dark:hidden"
        aria-hidden="true"
      >
        <g clipPath="url(#clip0_40_125)">
          <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
        </g>
      </svg>
    </button>
  );
};

export default ThemeToggler;
