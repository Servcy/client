import { GoBlocked } from "react-icons/go";

export default function Blocked(): JSX.Element {
  return (
    <main className="order-2 m-auto h-screen p-24">
      <div className="flex h-full flex-col items-center justify-center">
        <GoBlocked className="h-32 w-32 text-servcy-black" />
        <p className="mt-2 text-servcy-black">
          Oops... Servcy is not available for mobile devices yet.
        </p>
      </div>
    </main>
  );
}
