import { Copy, Linkedin, Facebook, MessageCircle, Share2 } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
interface ShareButtonProps {
  id: string;
  title?: string;
  ActiveShare?: boolean;
  isFullPost?: boolean;
}

export function ShareButton({
  id,
  title,
  ActiveShare = true,
  isFullPost = false,
}: ShareButtonProps) {
  const { toast } = useToast();

  const [postUrl, setPostUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPostUrl(`${window.location.origin}/post/${id}`);
    }
  }, [id]);

  const shareText = encodeURIComponent(title || "Check this out!");
  const encodedUrl = postUrl;

  const copyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    toast({
      title: "Link copied!",
      description: "The post link has been copied to your clipboard.",
    });
  };

  return (
    <>
      {ActiveShare ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`${
                isFullPost ? "w-full" : "w-fit"
              } md:w-fit h-fit py-1 px-3 rounded-xl focus-visible:ring-0`}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuLabel>Share on</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <a
                href={`https://wa.me/?text=${shareText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.whatsapp className="mr-2 h-4 w-4 text-green-500" />
                WhatsApp
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.x className="mr-2 h-4 w-4 text-sky-500" />
                Twitter / X
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.linkedin className="mr-2 h-4 w-4 text-blue-700" />
                LinkedIn
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook fill="blue" className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={copyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          className={`${
            false ? "w-full" : "w-fit"
          } md:w-fit h-fit py-1 px-3 rounded-xl focus-visible:ring-0`}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      )}
    </>
  );
}
