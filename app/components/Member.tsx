import { Button } from "@/components/ui/button";
import { Tilt } from "@/components/ui/tilt";

const members = [
  {
    img: "https://www.tnpgndec.com/_next/image?url=%2Foffice1.jpg&w=640&q=75",
    title: "Prof. G.S.Sodhi",
    desc: "Training and Placement Officer",
    phno: "+91 98722 19178",
    mail: "tpo@gndec.ac.in",
    role: "T&P Office",
  },
  {
    img: "https://www.tnpgndec.com/_next/image?url=%2Foffice2.png&w=640&q=75",
    title: "Dr. Sachin Bagga",
    desc: "Faculty Co-Coordinator",
    phno: "+91 97799 03785",
    mail: "tpo@gndec.ac.in",
    role: "Faculty",
  },
  {
    img: "https://www.tnpgndec.com/_next/image?url=%2Foffice3.png&w=640&q=75",
    title: "Sr. Narinder Singh",
    desc: "Senior Assistant",
    phno: "+91 97810 99970",
    mail: "tpo@gndec.ac.in",
    role: "Academic Queries",
  },
  {
    img: "https://www.tnpgndec.com/_next/image?url=%2Fabhijot.png&w=640&q=75",
    title: "Abhijot Singh",
    desc: "Student Coordinator",
    phno: "+91 70879 48904",
    mail: "tpo@gndec.ac.in",
    role: "Student",
  },
];

export default function Members() {
  return (
    <div className=" flex-col gap-4 sticky top-[0] hidden md:flex">
      {members.map((d, i) => (
        <div key={i}>
          <div className="text-muted-foreground text-sm font-medium">
            {d.role}
          </div>
          <div
            className={`flex flex-col gap-3 ${
              i == members.length - 1 ? "sticky top-[74px]" : ""
            }`}
          >
            <TiltSpotlight {...d} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TiltSpotlight(props: {
  img: string;
  title: string;
  desc: string;
  phno: string;
  mail: string;
}) {
  const { img, title, desc, phno, mail } = props;
  return (
    <div className=" max-w-sm p-1 pb-2 border rounded-xl w-fit flex items-center flex-col">
      <Tilt
        rotationFactor={6}
        isRevese
        style={{
          transformOrigin: "center center",
        }}
        springOptions={{
          stiffness: 26.7,
          damping: 4.1,
          mass: 0.2,
        }}
        className="group relative rounded-lg w-fit"
      >
        <img
          // src='https://images.beta.cosmos.so/f7fcb95d-981b-4cb3-897f-e35f6c20e830?format=jpeg'
          src={img}
          alt="Ghost in the shell - Kôkaku kidôtai"
          className="w-64 border h-full rounded-lg object-cover grayscale duration-700 group-hover:grayscale-0"
        />

        <div className="flex flex-col space-y-0.5 pb-0 pt-3 justify-center">
          <h3 className=" text-md font-medium text-black dark:text-zinc-400 text-center">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-white text-center">
            {desc}
          </p>
          <div className="flex gap-2 mt-2 flex-col">
            <a href={`tel:${phno}`}>
              <Button
                className="w-full border h-fit px-3 py-1 "
                variant={"secondary"}
              >
                {phno}
              </Button>
            </a>
            <a href={`mailto:${mail}`}>
              <Button className="w-full  h-fit px-3 py-1 " variant={"default"}>
                {mail}
              </Button>
            </a>
          </div>
        </div>
      </Tilt>
    </div>
  );
}
