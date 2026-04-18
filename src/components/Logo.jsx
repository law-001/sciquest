// components/Logo.jsx
const Logo = ({ size = 30, className = "" }) => {
  return (
    <div className="inline-block">
      <svg
        width={size}
        height={size}
        viewBox="0 0 33 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform ${className}`} // 👈 allows animation + smooth transforms
      >
        <path
          d="M16.0477 17.3849C16.7863 17.3849 17.385 16.7862 17.385 16.0476C17.385 15.3091 16.7863 14.7103 16.0477 14.7103C15.3091 14.7103 14.7104 15.3091 14.7104 16.0476C14.7104 16.7862 15.3091 17.3849 16.0477 17.3849Z"
          stroke="currentColor" // 👈 allows color control via Tailwind
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27.0136 27.0136C29.7417 24.2989 27.0403 17.171 20.9957 11.0996C14.9243 5.05501 7.7965 2.35365 5.08176 5.08176C2.35365 7.79649 5.05502 14.9243 11.0996 20.9957C17.171 27.0403 24.2989 29.7417 27.0136 27.0136Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.9957 20.9957C27.0403 14.9243 29.7417 7.79649 27.0136 5.08176C24.2989 2.35365 17.171 5.05501 11.0996 11.0996C5.05502 17.171 2.35365 24.2989 5.08176 27.0136C7.7965 29.7417 14.9243 27.0403 20.9957 20.9957Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Logo;