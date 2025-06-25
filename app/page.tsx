import Container from "@/components/ui/container";
import Stats from "./_components/Stats";
import Topics from "./_components/Topics";

export default function Home() {
  return (
    <Container className="flex flex-col gap-4">
      <Stats />
      <Topics />
    </Container>
  );
}
