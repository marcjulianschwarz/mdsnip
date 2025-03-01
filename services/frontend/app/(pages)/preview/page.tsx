"use client";

import DropdownComponent, {
  DropDownItemType,
} from "@/app/components/Dropdown/DropdownComponent";
import styles from "./preview.module.css";
import DropToastComponent, {
  DropToastStyle,
} from "@/app/components/DropToast/DropToastComponent";
import MarkdownComponent from "@/app/components/HTMLContent/MarkdownComponent";

function Story({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className={styles.story}>
      <p style={{ visibility: "hidden" }}>{title}</p>
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <div className={styles.stories}>
      <Story title="DropToast">
        <DropToastComponent
          isOpen={true}
          text="Copied succesfully"
          style={DropToastStyle.Success}
        />
      </Story>
      <Story>
        <DropToastComponent
          isOpen={true}
          text="Copy failed"
          style={DropToastStyle.Warning}
        />
      </Story>
      <Story>
        <DropToastComponent isOpen={true} text="Copy" />
      </Story>
      <Story title="Dropdown">
        <DropdownComponent
          setIsOpen={() => {}}
          items={[
            {
              label: "Text One",
            },
            {
              label: "Text Two",
            },
            {
              label: "Text Three",
            },
            {
              label: "Text Danger",
              type: DropDownItemType.DESTROY,
            },
            {
              label: "Text Warning",
              type: DropDownItemType.WARNING,
            },
          ]}
        />
      </Story>

      <Story title="Markdown">
        <MarkdownComponent
          markdown={"**This** is some *markdown*. \n> Blockquote here."}
        />
      </Story>
    </div>
  );
}
