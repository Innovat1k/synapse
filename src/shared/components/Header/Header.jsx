import { Avatar } from "radix-ui";

function Header() {
  const user = { name: "Simon", region: "Switzerland" };

  return (
    <div className="flex justify-between px-2 border border-b-cyan-700">
      <h1 className="capitalize">synapse</h1>
      <div className="md:flex items-center">
        <Avatar.Root>
          {/* <Avatar.AvatarImage src="public/user-img.jpeg" /> */}
          <Avatar.Fallback>{`${user.name} picture`}</Avatar.Fallback>
        </Avatar.Root>
        <div className="max-sm:hidden flex flex-col">
          <span className="font-bold">{user.name}</span>
          <p className="text-sm">{user.region}</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
