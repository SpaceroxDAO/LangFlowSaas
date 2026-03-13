import { Composition, staticFile } from "remotion";
import { Scene, myCompSchema } from "./Scene";
import { getMediaMetadata } from "./helpers/get-media-metadata";
import { LaunchVideo, getTotalDuration } from "./LaunchVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ========== LAUNCH VIDEO ========== */}
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        fps={30}
        durationInFrames={300}
        width={1920}
        height={1080}
        defaultProps={{
          heroMetadata: null,
          sectionMetadata: null,
          heroDurationInFrames: 0,
        }}
        calculateMetadata={async () => {
          const heroSrc = staticFile("overview.mp4");
          const sectionSrc = staticFile("build.mp4");
          const [heroMetadata, sectionMetadata] = await Promise.all([
            getMediaMetadata(heroSrc),
            getMediaMetadata(sectionSrc),
          ]);
          const heroDurationInFrames = Math.round(heroMetadata.durationInSeconds * 30);

          return {
            durationInFrames: getTotalDuration(heroDurationInFrames),
            props: {
              heroMetadata,
              sectionMetadata,
              heroDurationInFrames,
            },
          };
        }}
      />

      {/* ========== ORIGINAL TEMPLATE SCENE ========== */}
      <Composition
        id="Scene"
        component={Scene}
        fps={30}
        durationInFrames={300}
        width={1280}
        height={720}
        schema={myCompSchema}
        defaultProps={{
          deviceType: "phone",
          phoneColor: "rgba(110, 152, 191, 0.00)" as const,
          baseScale: 1,
          mediaMetadata: null,
          videoSrc: null,
        }}
        calculateMetadata={async ({ props }) => {
          const videoSrc =
            props.deviceType === "phone"
              ? staticFile("phone.mp4")
              : staticFile("tablet.mp4");

          const mediaMetadata = await getMediaMetadata(videoSrc);

          return {
            props: {
              ...props,
              mediaMetadata,
              videoSrc,
            },
          };
        }}
      />
    </>
  );
};
