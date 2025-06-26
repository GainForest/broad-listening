import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaTelegram } from "react-icons/fa6";

export default function Home() {
  return (
    <Container outerClassName="flex-1" className="flex flex-col flex-1">
      <h1
        className="text-6xl md:text-8xl font-bold font-pixel my-2"
        style={{
          textShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
        }}
      >
        Envisioning
        <br /> <span className="text-primary">Bhutan</span>
        <br /> <span>2035</span>
      </h1>
      {/* <div className="flex-1"></div> */}
      <div
        className="font-sans text-xl bg-background/70 backdrop-blur-lg max-w-lg w-full p-4 rounded-xl mt-8 mb-8"
        style={{
          textShadow: "0px 0px 4px rgba(255 255 255 / 1)",
        }}
      >
        Meet TakinAI, your guide to imagining Bhutan&apos;s digital future.{" "}
        <Button className="w-full mt-2 h-10">
          <FaTelegram />
          Talk to TakinAI on Telegram
        </Button>
      </div>
    </Container>
  );
}
