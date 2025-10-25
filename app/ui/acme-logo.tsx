import { nunito } from "./fonts";

export default function AcmeLogo() {
  return (
    <div
      className={`${nunito.className} flex md:flex-col leading-none text-white`}
    >
      <p className="text-[44px]">Dash_</p>
      <p className="text-[44px]">Board</p>
    </div>
  );
}
