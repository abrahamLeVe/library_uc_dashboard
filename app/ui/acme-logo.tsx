import { nunito } from "./fonts";

export default function AcmeLogo() {
  return (
    <div
      className={`${nunito.className} flex flex-col leading-none text-white`}
    >
      <p className="text-[44px]">Library UC</p>
    </div>
  );
}
