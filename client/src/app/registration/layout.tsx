import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration",
  description: "Registration"
};

const Layout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="w-[500px] h-[500px] bg-[#393E46] rounded-lg shadow-lg flex">
        {children}
      </div>
    </main>
  );
};

export default Layout;
