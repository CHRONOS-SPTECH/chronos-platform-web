import HomeConcepts from "../../components/features/home/HomeConcepts";
import useHomeInstrutor from "../../hooks/useHomeInstrutor";

export default function HomeInstrutor() {
  const { iniciarPresenca } = useHomeInstrutor();
  return <HomeConcepts role="instrutor" onStartAttendance={iniciarPresenca} />;
}
