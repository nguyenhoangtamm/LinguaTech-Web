"use client";

import { useGetTreeViewMenuQuery } from "@/queries/useMenu";
import { flattenMenuWithRoot, FlatTreeItem } from "@/utils/flatten-menu";
import { useEffect } from "react";
import TreeView from "react-accessible-treeview";
import * as Icons from "lucide-react";

type DynamicIconProps = {
  iconName: string;
  size?: number;
  color?: string;
};

function DynamicIcon({ iconName, size = 24, color = "white" }: DynamicIconProps) {
  const LucideIcon = (Icons as any)[iconName];

  if (!LucideIcon) {
    return;
  }

  return <LucideIcon size={size} color={color} />;
}

export default function TreeViewMenu({
  refreshKey,
  onSelectMenu,
}: {
  refreshKey: number;
  onSelectMenu: (id: number) => void;
}) {
  const { data, isLoading, isError, error, refetch } =
    useGetTreeViewMenuQuery();

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  if (isLoading) return <div>Đang tải...</div>;
  if (isError)
    return (
      <div>
        Lỗi:{" "}
        {error instanceof Error ? error.message : "Lỗi không xác định"}
      </div>
    );

  const flatTree: FlatTreeItem[] = flattenMenuWithRoot(
    data?.data ?? []
  );

  // Tạo map để tra cứu node theo id
  const nodeMap = new Map<number, FlatTreeItem>();
  flatTree.forEach((item) => nodeMap.set(item.id, item));

  return (
    <div className="p-4 relative">
      <TreeView
        data={flatTree}
        aria-label="Directory tree"
        nodeRenderer={({
          element,
          isBranch,
          isExpanded,
          getNodeProps,
          level,
        }) => {
          const handleClick = () => {
            onSelectMenu(Number(element.id));
          };

          // Xác định node hiện tại có phải là node cuối cùng trong nhánh cha không
          let isLast = false;
          if (element.parent !== null) {
            const parent = nodeMap.get(Number(element.parent));
            if (parent && parent.children.length > 0) {
              isLast = parent.children[parent.children.length - 1] === element.id;
            }
          }

          // Hiển thị đường kẻ dọc cho các cấp cha, trừ cấp cuối
          const levelIndent = [];
          let ancestorId = element.parent;
          for (let i = 0; i < level - 1; i++) {
            let ancestor = nodeMap.get(Number(ancestorId!));
            let showLine = true;
            if (ancestor && ancestor.parent !== null) {
              const ancestorParent = nodeMap.get(Number(ancestor.parent));
              if (
                ancestorParent &&
                ancestorParent.children[ancestorParent.children.length - 1] === ancestor.id
              ) {
                showLine = false;
              }
            }
            levelIndent.push(
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: "16px",
                  textAlign: "center",
                  color: "#bbb",
                  userSelect: "none",
                }}
              >
                {showLine ? "│" : ""}
              </span>
            );
            ancestorId = ancestor?.parent ?? null;
          }

          // Xác định ký hiệu nhánh
          let branchSymbol = "";
          if (level > 0) {
            branchSymbol = isLast ? "└──" : "├──";
          }

          return (
            <div
              {...getNodeProps({
                onClick: (event) => {
                  getNodeProps().onClick?.(event);
                  handleClick();
                },
              })}
              id={`node-${element.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "15px",
                lineHeight: "22px",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "2px 0",
                margin: 0,
                minHeight: 28,
              }}
            >
              {/* Dotted vertical lines for each ancestor level */}
              {Array.from({ length: level - 1 }).map((_, i) => {
                let ancestorId = element.parent;
                for (let j = 0; j < level - 2 - i; j++) {
                  ancestorId = nodeMap.get(Number(ancestorId!))?.parent ?? null;
                }
                let ancestor = nodeMap.get(Number(ancestorId!));
                // Luôn vẽ đường dọc nếu ancestor không phải là node cuối cùng
                let showLine = true;
                if (ancestor && ancestor.parent !== null) {
                  const ancestorParent = nodeMap.get(Number(ancestor.parent));
                  if (
                    ancestorParent &&
                    ancestorParent.children[ancestorParent.children.length - 1] === ancestor.id
                  ) {
                    showLine = false;
                  }
                }
                // Sửa lại: LUÔN vẽ đường dọc nếu ancestor có con hoặc ancestor chưa phải là node cuối cùng của cha
                if (ancestor && ancestor.parent !== null) {
                  const ancestorParent = nodeMap.get(Number(ancestor.parent));
                  if (
                    ancestorParent &&
                    ancestorParent.children[ancestorParent.children.length - 1] === ancestor.id
                    && ancestorParent.children.length === 1
                  ) {
                    showLine = false;
                  } else {
                    showLine = true;
                  }
                }
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      width: "22px",
                      height: "28px",
                      boxSizing: "border-box",
                      position: "relative",
                      verticalAlign: "top",
                    }}
                  >
                    {showLine && (
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          bottom: 0,
                          borderLeft: "1.5px dotted #bbb",
                          transform: "translateX(-50%)",
                          height: "100%",
                        }}
                      />
                    )}
                  </span>
                );
              })}

              {/* Dotted horizontal and vertical for current node */}
              {level > 0 && (
                <span
                  style={{
                    display: "inline-block",
                    width: "22px",
                    height: "28px",
                    position: "relative",
                    verticalAlign: "top",
                  }}
                >
                  {/* Vertical line */}
                  {!isLast ? (
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        width: "1.5px",
                        height: "30px",
                        borderLeft: "1.5px dotted #bbb",
                        transform: "translateX(-50%)",
                        zIndex: 1,
                      }}
                    />
                  ) :
                    (
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          width: "1.5px",
                          height: "14px",
                          borderLeft: "1.5px dotted #bbb",
                          transform: "translateX(-50%)",
                          zIndex: 1,
                        }}
                      />
                    )


                  }
                  {/* Horizontal line */}
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "14px",
                      width: "14px",
                      height: "1.5px",
                      borderBottom: "1.5px dotted #bbb",
                      zIndex: 2,
                    }}
                  />
                  {isBranch && (level === 1 || level === 2) ? (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "2px",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #bbb",
                        borderRadius: "2px",
                        background: "#fff",
                        fontSize: "13px",
                        zIndex: 3,
                        userSelect: "none",
                      }}
                    >
                      {isExpanded ? "−" : "+"}
                    </span>
                  ) : (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "2px",
                        width: "16px",
                        height: "16px",
                        zIndex: 3,
                        userSelect: "none",
                      }}
                    />
                  )}
                </span>
              )}

              {/* Icon và tên */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginLeft: isBranch ? 2 : 0,
                }}
              >
                <span style={{ width: 20, display: "inline-block", textAlign: "center" }}>
                  {typeof element.metadata?.icon === "string" && (Icons as any)[element.metadata.icon] ? (
                  <DynamicIcon
                    iconName={element.metadata.icon}
                    size={16}
                    color="#bbb"
                  />
                  ) : (
                  <span style={{ fontSize: 16 }}>
                    {isBranch ? "📁" : "📄"}
                  </span>
                  )}
                </span>
                <span>{element.name}</span>
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}