import { useOutletContext } from "react-router-dom";

function DashBoard() {
  const { methods } = useOutletContext()

  return (
    <div>
      <h1>Dashboard</h1>
      <button
        className="cursor-pointer bg-amber-50 hover:bg-amber-100"
        onClick={methods.handleSignOut}
      >
        Log Out
      </button>
      <div>
        <h2>Skills Overview</h2>
        <div></div>
      </div>
      <div>
        <h2>Weekly Progress</h2>
        <div></div>
      </div>
    </div>
  );
}

export default DashBoard;
