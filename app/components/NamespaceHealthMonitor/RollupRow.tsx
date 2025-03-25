import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Github,
  Twitter,
} from "lucide-react";
import { RollupInfo } from "../../types/namespace";

interface RollupRowProps {
  rollup: RollupInfo;
  index: number;
}

const RollupRow: React.FC<RollupRowProps> = ({ rollup, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const discordLink = rollup.links?.find((link) => link.includes("discord"));

  return (
    <>
      <tr
        key={`row-${index}`}
        className="border-t cursor-pointer hover:bg-gray-50"
        onClick={toggleExpand}
      >
        <td className="px-4 py-2 flex items-center">
          {isExpanded ? (
            <ChevronDown className="mr-2 w-4 h-4" />
          ) : (
            <ChevronRight className="mr-2 w-4 h-4" />
          )}
          <div className="flex items-center">
            {rollup.logo && (
              <img
                src={rollup.logo}
                alt={`${rollup.name} logo`}
                className="w-6 h-6 mr-2 rounded-full"
              />
            )}
            {rollup.name}
          </div>
        </td>
        <td className="px-4 py-2">
          <a
            href={rollup.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate max-w-xs">
              {new URL(rollup.website).hostname.replace("www.", "")}
            </span>
            <ExternalLink size={14} className="ml-1 inline" />
          </a>
        </td>
        <td className="px-4 py-2">
          <a
            href={rollup.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Twitter size={16} className="inline mr-1" />
            <span>@{rollup.twitter.split("/").pop()}</span>
          </a>
        </td>
      </tr>

      {isExpanded && (
        <tr key={`expanded-${index}`} className="bg-gray-50">
          <td colSpan={4} className="px-4 py-4">
            <div className="p-2">
              {/* Header with logo and description */}
              <div className="flex items-start mb-6">
                {rollup.logo && (
                  <img
                    src={rollup.logo}
                    alt={`${rollup.name} logo`}
                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium text-lg">{rollup.name}</h4>
                  <p className="text-gray-700 mt-1">
                    {rollup.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Technical details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Type</p>
                  <p className="capitalize">{rollup.type || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">VM</p>
                  <p>{rollup.vm || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Stack</p>
                  <p>{rollup.stack || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Category</p>
                  <p className="capitalize">
                    {rollup.category || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Links section */}
              <div className="space-y-2">
                <h5 className="font-medium">Links</h5>
                <div className="flex flex-wrap gap-3">
                  {rollup.website && (
                    <a
                      href={rollup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Website
                    </a>
                  )}

                  {rollup.explorer && (
                    <a
                      href={rollup.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Explorer
                    </a>
                  )}

                  {rollup.github && (
                    <a
                      href={rollup.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={14} className="mr-1" />
                      GitHub
                    </a>
                  )}

                  {discordLink && (
                    <a
                      href={discordLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Discord
                    </a>
                  )}

                  {rollup.l2_beat && (
                    <a
                      href={rollup.l2_beat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      L2Beat
                    </a>
                  )}

                  {/* Docs link if present */}
                  {rollup.links?.find((link) => link.includes("docs")) && (
                    <a
                      href={rollup.links.find((link) => link.includes("docs"))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Docs
                    </a>
                  )}

                  {/* Additional links (excluding discord and docs which we already handled) */}
                  {rollup.links
                    ?.filter(
                      (link) =>
                        !link.includes("discord") && !link.includes("docs")
                    )
                    .map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        {new URL(link).hostname.replace("www.", "")}
                      </a>
                    ))}
                </div>
              </div>

              {/* Tags */}
              {rollup.tags &&
                rollup.tags.length > 0 &&
                rollup.tags[0] !== "" && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {rollup.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default RollupRow;
