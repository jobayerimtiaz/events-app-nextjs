import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import events from "@/lib/constants";
import { title } from "process";

const page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub of every Dev <br /> Event you cant miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups and Conferences all in one place
      </p>
      <ExploreBtn></ExploreBtn>
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event}></EventCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
export default page;
