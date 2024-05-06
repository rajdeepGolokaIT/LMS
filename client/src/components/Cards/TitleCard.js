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
        <div className="text-xl text-gray-700/90 dark:text-gray-400 font-bold text-center md:text-left mb-5">
        {title}
        </div>

        {/* Top side button, show only if present */}
        {TopSideButtons1 && (
          <div className=" grid md:grid-flow-col grid-flow-col gap-4 md:float-right float-right">
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
