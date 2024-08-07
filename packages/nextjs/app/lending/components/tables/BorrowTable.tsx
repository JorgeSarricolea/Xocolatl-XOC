import React from "react";
import { BorrowTableProps } from "@/types/assets/assets";

/**
 * BorrowTable component displays a table of assets with borrowing details and actions,
 * including amount, APY, APY type or borrow rate, and borrow/repay actions.
 *
 * @param {BorrowTableProps} props - Props containing assets data and action handler.
 * @param {Array<any>} props.assets - Array of assets to display in the table.
 * @param {boolean} props.isBorrowed - Flag indicating whether the table is displaying borrowed assets.
 * @param {Function} props.onAction - Handler function invoked when a borrow or repay action button is clicked.
 */
const BorrowTable: React.FC<BorrowTableProps> = ({ assets, isBorrowed, onAction }) => {
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-center">
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {isBorrowed ? "Debt" : "Available"}
            </th>
            {isBorrowed && (
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                APY
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {isBorrowed ? "APY Type" : "APY Borrow Rate"}
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-center">
          {assets.map((asset, index) => (
            <tr key={index}>
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900">{asset.asset}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-900">{asset.amount}</p>
                <p className="text-xs text-gray-900">${asset.amountConverted}</p>
              </td>
              {isBorrowed && (
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{asset.apy}%</p>
                </td>
              )}
              <td className="px-6 py-4">
                <p className="text-sm text-gray-900">{isBorrowed ? asset.apyType : `${asset.borrowRate}%`}</p>
              </td>
              <td className="py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onAction(asset)}
                  className={`px-3 py-1 rounded-md ${
                    asset.amount === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-accent text-white"
                  }`}
                  disabled={asset.amount === 0}
                >
                  {isBorrowed ? "Repay" : "Borrow"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowTable;
