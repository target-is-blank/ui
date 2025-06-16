export default function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      aria-label="X"
      {...props}
    >
      <path
        fill="currentColor"
        d="m26.37 26-8.795-12.822.015.012L25.52 4h-2.65l-6.46 7.48L11.28 4H4.33l8.211 11.971-.001-.001L3.88 26h2.65l7.182-8.322L19.42 26zM10.23 6l12.34 18h-2.1L8.12 6z"
      ></path>
    </svg>
  );
}
