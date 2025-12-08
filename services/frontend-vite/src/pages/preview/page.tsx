import DropdownComponent from "@/components/Dropdown/DropdownComponent";
import styles from "./preview.module.css";
import DropToastComponent from "@/components/DropToast/DropToastComponent";
import MarkdownComponent from "@/components/HTMLContent/MarkdownComponent";

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
          style={"success"}
        />
      </Story>
      <Story>
        <DropToastComponent
          isOpen={true}
          text="Copy failed"
          style={"warning"}
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
              type: "destroy",
            },
            {
              label: "Text Warning",
              type: "warning",
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
