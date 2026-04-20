'use client';

import { useState, useCallback, useMemo } from 'react';

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

interface TreeNodeProps {
  node: MindMapNode;
  depth: number;
  expandedSet: Set<string>;
  onToggle: (id: string) => void;
  searchTerm: string;
}

const DEPTH_COLORS = [
  'bg-blue-600 text-white border-blue-600',
  'bg-blue-50 text-blue-800 border-blue-200',
  'bg-emerald-50 text-emerald-800 border-emerald-200',
  'bg-amber-50 text-amber-800 border-amber-200',
  'bg-purple-50 text-purple-800 border-purple-200',
  'bg-rose-50 text-rose-800 border-rose-200',
  'bg-slate-50 text-slate-700 border-slate-200',
];

function TreeNode({ node, depth, expandedSet, onToggle, searchTerm }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedSet.has(node.id);
  const isMatch = searchTerm && node.label.toLowerCase().includes(searchTerm.toLowerCase());

  const colorClass = DEPTH_COLORS[Math.min(depth, DEPTH_COLORS.length - 1)];

  return (
    <div className="flex items-start">
      {/* 节点卡片 */}
      <div className="flex-shrink-0 flex items-center">
        <button
          onClick={() => hasChildren && onToggle(node.id)}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm select-none transition-all
            ${depth === 0 ? 'font-bold text-base px-4 py-2 shadow-md' : 'font-medium'}
            ${colorClass}
            ${hasChildren ? 'cursor-pointer hover:shadow-md hover:brightness-95' : 'cursor-default'}
            ${isMatch ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
          `}
        >
          {hasChildren && (
            <svg
              className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span className="whitespace-nowrap">{node.label}</span>
        </button>
      </div>

      {/* 子节点 + 连接线 */}
      {hasChildren && isExpanded && (
        <div className="ml-4 pl-4 flex flex-col gap-2 relative">
          {/* 竖线 */}
          <div
            className="absolute left-0 bg-slate-300"
            style={{
              top: '1.25rem',
              bottom: '1.25rem',
              width: '2px',
            }}
          />
          {node.children!.map((child) => (
            <div key={child.id} className="flex items-center relative">
              {/* 横线 */}
              <div
                className="absolute bg-slate-300"
                style={{
                  left: '-1rem',
                  width: '1rem',
                  height: '2px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <TreeNode
                node={child}
                depth={depth + 1}
                expandedSet={expandedSet}
                onToggle={onToggle}
                searchTerm={searchTerm}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function collectAllIds(node: MindMapNode): string[] {
  const ids = [node.id];
  if (node.children) {
    node.children.forEach((child) => ids.push(...collectAllIds(child)));
  }
  return ids;
}

function getIdsToDepth(node: MindMapNode, maxDepth: number, currentDepth = 0): string[] {
  const ids = [node.id];
  if (currentDepth < maxDepth && node.children) {
    node.children.forEach((child) => ids.push(...getIdsToDepth(child, maxDepth, currentDepth + 1)));
  }
  return ids;
}

interface MindMapProps {
  data: MindMapNode;
}

export default function MindMap({ data }: MindMapProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSet, setExpandedSet] = useState<Set<string>>(() => {
    // 默认展开前两层
    return new Set(getIdsToDepth(data, 2));
  });

  const allIds = useMemo(() => new Set(collectAllIds(data)), [data]);

  const handleToggle = useCallback((id: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedSet(new Set(allIds));
  }, [allIds]);

  const collapseAll = useCallback(() => {
    setExpandedSet(new Set([data.id]));
  }, [data.id]);

  const expandToMatch = useCallback(() => {
    if (!searchTerm.trim()) return;
    const term = searchTerm.toLowerCase();
    const ids = new Set<string>();

    function traverse(node: MindMapNode): boolean {
      const matches = node.label.toLowerCase().includes(term);
      let childMatches = false;
      if (node.children) {
        node.children.forEach((child) => {
          if (traverse(child)) childMatches = true;
        });
      }
      if (matches || childMatches) {
        ids.add(node.id);
      }
      return matches || childMatches;
    }

    traverse(data);
    setExpandedSet(ids);
  }, [searchTerm, data]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* 工具栏 */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            全部展开
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            全部折叠
          </button>
        </div>
        <div className="h-4 w-px bg-slate-300" />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && expandToMatch()}
            placeholder="搜索节点..."
            className="text-sm px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
          <button
            onClick={expandToMatch}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            定位
          </button>
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setExpandedSet(new Set(getIdsToDepth(data, 2))); }}
              className="text-xs px-2 py-1.5 text-slate-500 hover:text-slate-700"
            >
              清除
            </button>
          )}
        </div>
        <div className="ml-auto text-xs text-slate-400">
          点击节点可展开/收缩
        </div>
      </div>

      {/* 思维导图区域 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="min-w-max">
          <TreeNode
            node={data}
            depth={0}
            expandedSet={expandedSet}
            onToggle={handleToggle}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
}
