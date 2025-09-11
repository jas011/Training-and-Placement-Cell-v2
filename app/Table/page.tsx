import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTableDemo } from "./component/dataTable";

export default function MorphingDialogBasicTwo({
  data,
  fileName,
}: {
  data: any;
  fileName: string;
}) {
  return (
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
        className="border border-gray-200/60 bg-white h-fit"
      >
        <div className="flex items-center  py-2 px-1.5">
          <div className="flex flex-col items-start justify-center space-y-0">
            <MorphingDialogTitle className=" font-medium text-black sm:text-xs">
              {fileName.toUpperCase()}
            </MorphingDialogTitle>
          </div>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: "12px",
          }}
          className="relative h-auto w-[50%]  border border-gray-100 bg-white"
        >
          <div className="flex flex-col items-start justify-center mx-5 mt-5">
            <MorphingDialogTitle className="text-black">
              {fileName.toUpperCase()}
            </MorphingDialogTitle>
          </div>
          <ScrollArea className="h-[90vh]" type="scroll">
            <div className="m-5">
              <DataTableDemo data={data} />
            </div>
          </ScrollArea>
          <MorphingDialogClose className="text-zinc-500" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
