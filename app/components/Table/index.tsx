import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataTableDemo } from "./component/dataTable";

interface CSVRow {
  [key: string]: string;
}
export default function MorphingDialogBasicTwo({
  data,
  fileName,
}: {
  data: CSVRow[];
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
          borderRadius: "8px",
        }}
        className="border border-primary bg-white h-fit"
      >
        <div className="flex items-center  py-1 px-3  ">
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
          className="relative h-[90vh] w-[80%] lg:w-[60%]   border border-gray-100 bg-white "
        >
          <div className="flex flex-col items-start justify-center mx-5 mt-5">
            <MorphingDialogTitle className="text-black mt-1 w-[50vw]">
              {fileName.toUpperCase()}
            </MorphingDialogTitle>
          </div>
          <ScrollArea
            className="h-[90vh] overflow-x-auto mx-5 mt-5"
            type="scroll"
          >
            <div className="m-5">
              <DataTableDemo data={data} />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <MorphingDialogClose className="text-zinc-500" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
