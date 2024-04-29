import Subtitle from "../Typography/Subtitle";

function TitleCard({
  title,
  children,
  topMargin,
  TopSideButtons1,
  TopSideButtons2,
  TopSideButtons3,
  TopSideButtons4,
}) {
  return (
    <div
      className={
        "card w-full p-6 bg-base-100 shadow-xl " + (topMargin || "mt-6")
      }
    >
      {/* Title for Card */}
      <Subtitle styleClass={TopSideButtons1 ? "inline-block" : ""}>
        {title}

        {/* Top side button, show only if present */}
        {TopSideButtons1 && (
          <div className=" flex md:flex-row flex-col  grid-cols-1 gap-6 float-right">
            {TopSideButtons1} {TopSideButtons2} {TopSideButtons3}
            {TopSideButtons4}
          </div>
        )}
      </Subtitle>

      <div className="divider mt-2"></div>

      {/** Card Body */}
      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </div>
  );
}

export default TitleCard;
