import { ScrollArea } from "@/components/ui/scroll-area";
import Card from "./card";

export default function MorphingDialogBasicTwo() {
  return (
    <div className="flex justify-center  w-full">
      <div className="w-[90%] flex flex-col gap-5 justify-center">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

/*
 <MorphingDialog
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: "4px",
        }}
        className="border border-gray-200/60 bg-white w-[80%]"
      >
        <div className="flex items-center space-x-3 p-3  ">
          <Card />
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: "12px",
          }}
          className="relative h-auto w-[500px] border border-gray-100 bg-white"
        >
          <ScrollArea className="h-[90vh]" type="scroll">
            <div className="relative p-6">
              <div className="flex justify-center py-10">
                <MorphingDialogImage
                  src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
                  alt="What I Talk About When I Talk About Running - book cover"
                  className="h-auto w-[200px]"
                />
              </div>
              <div className="">
                <MorphingDialogTitle className="text-black">
                  What I Talk About When I Talk About Running
                </MorphingDialogTitle>
                <MorphingDialogSubtitle className="font-light text-gray-400">
                  Haruki Murakami
                </MorphingDialogSubtitle>
                <div className="mt-4 text-sm text-gray-700">
                  <p>
                    In 1982, having sold his jazz bar to devote himself to
                    writing, Murakami began running to keep fit. A year later,
                    he’d completed a solo course from Athens to Marathon, and
                    now, after dozens of such races, not to mention triathlons
                    and a dozen critically acclaimed books, he reflects upon the
                    influence the sport has had on his life and—even more
                    important—on his writing.
                  </p>
                  <p>
                    Equal parts training log, travelogue, and reminiscence, this
                    revealing memoir covers his four-month preparation for the
                    2005 New York City Marathon and takes us to places ranging
                    from Tokyo’s Jingu Gaien gardens, where he once shared the
                    course with an Olympian, to the Charles River in Boston
                    among young women who outpace him. Through this marvelous
                    lens of sport emerges a panorama of memories and insights:
                    the eureka moment when he decided to become a writer, his
                    greatest triumphs and disappointments, his passion for
                    vintage LPs, and the experience, after fifty, of seeing his
                    race times improve and then fall back.
                  </p>
                  <p>
                    By turns funny and sobering, playful and philosophical, What
                    I Talk About When I Talk About Running is rich and
                    revelatory, both for fans of this masterful yet guardedly
                    private writer and for the exploding population of athletes
                    who find similar satisfaction in running.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
          <MorphingDialogClose className="text-zinc-500" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>*/
