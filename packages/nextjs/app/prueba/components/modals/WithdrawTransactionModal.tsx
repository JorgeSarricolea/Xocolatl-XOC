import React, { useEffect, useState } from "react";
import useAccountAddress from "@/hooks/useAccount";
import useWithdraw from "@/hooks/useWithdraw";
import { ReserveData } from "@/types/types";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Address } from "viem";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserve: ReserveData | null;
  balance: string;
}

/**
 * Converts an amount to its equivalent value in wei.
 * @param {number} amount - The amount to convert.
 * @param {number} [decimals=18] - The number of decimals used for conversion.
 * @returns {BigInt} - The equivalent value in wei.
 */
function toWei(amount: number, decimals: number = 18): BigInt {
  return BigInt(Math.round(amount * Math.pow(10, decimals)));
}

const WithdrawTransactionModal: React.FC<ModalProps> = ({ isOpen, onClose, reserve, balance }) => {
  // State management for the amount to be withdrawn, validity check, and error messages
  const [amount, setAmount] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<any>(null); // Reset data state
  const [isError, setIsError] = useState(false); // Reset isError state
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  // Hook for handling withdraw transactions
  const { handleWithdraw, isError: withdrawError, error, data: withdrawData } = useWithdraw();

  // Fetch the user's wallet address
  const { address: walletAddress } = useAccountAddress();

  useEffect(() => {
    validateAmount(amount);
  }, [amount]);

  useEffect(() => {
    // Update state based on withdraw hook response
    if (withdrawError) {
      setIsError(true);
      setErrorMessage(error?.message || "An unknown error occurred.");
    }
    if (withdrawData) {
      setData(withdrawData);
    }
  }, [withdrawError, withdrawData, error]);

  /**
   * Validates the input amount for withdraw.
   * @param {string} value - The amount input value.
   */
  const validateAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setIsValid(false);
      setErrorMessage("Amount must be a positive number.");
    } else if (numValue > parseFloat(balance)) {
      setIsValid(false);
      setErrorMessage("Amount exceeds wallet balance.");
    } else if (numValue === 0) {
      setIsValid(false);
      setErrorMessage("Amount must be greater than zero.");
    } else {
      setIsValid(true);
      setErrorMessage("");
    }
  };

  /**
   * Handles changes to the input amount.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  /**
   * Sets the input amount to the maximum available balance.
   */
  const handleMaxClick = () => {
    setAmount(balance);
  };

  /**
   * Handles the withdraw button click event.
   */
  const handleWithdrawClick = () => {
    if (walletAddress) {
      try {
        const amountInWei = toWei(parseFloat(amount)); // Assuming 18 decimals, adjust if different
        handleWithdraw(reserve!.underlyingAsset as Address, amountInWei, walletAddress as Address);
      } catch (err) {
        console.error("Error converting amount to BigInt:", err);
      }
    } else {
      console.error("User wallet address is not available.");
    }
  };

  /**
   * Handles copying the error message to the clipboard.
   */
  const handleCopyError = () => {
    if (error?.message) {
      navigator.clipboard
        .writeText(error.message)
        .then(() => {
          console.log("Error copied to clipboard");
          setShowSuccessIcon(true);
          setTimeout(() => {
            setShowSuccessIcon(false);
          }, 1500);
        })
        .catch(err => {
          console.error("Failed to copy error to clipboard", err);
        });
    }
  };

  /**
   * Handles closing the modal and resetting state.
   */
  const handleClose = () => {
    setAmount("");
    setIsValid(false);
    setErrorMessage("");
    setData(null);
    setIsError(false);
    onClose(); // Call the original onClose handler
  };

  // Return null if the modal is not open or if the reserve data is not available
  if (!isOpen || !reserve) {
    return null;
  }

  return (
    <div className="modal-blur-background">
      <div className="modal-container general-text-color flex flex-col gap-6">
        <h2>Withdraw {reserve.symbol}</h2>
        <div className="table-border-top">
          {!data && !isError && (
            <div className="flex flex-col gap-6 mt-6">
              <div className="container-gray-borders flex flex-col gap-2">
                <label className="font-bold">Amount</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="without-borders"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleChange}
                  />
                  <span className="font-bold">{reserve.symbol}</span>
                </div>
                <div className="text-xs">
                  Supply balance: {balance}{" "}
                  <span className="font-bold hover:underline cursor-pointer" onClick={handleMaxClick}>
                    MAX
                  </span>
                </div>
                {errorMessage && <p className="text-error text-xs">{errorMessage}</p>}
              </div>

              <div className="flex justify-between gap-4">
                <button
                  className={`flex-grow-2 basis-2/3 ${isValid ? "primary-btn" : "disabled-btn"}`}
                  onClick={handleWithdrawClick}
                  disabled={!isValid}
                >
                  Withdraw
                </button>
                <button onClick={handleClose} className="secondary-btn flex-grow-1 basis-1/3">
                  Cancel
                </button>
              </div>
            </div>
          )}
          {isError && (
            <div className="flex flex-col gap-6 mt-6">
              <div className="error-container text-center">
                <p>
                  You cancelled the transaction.{" "}
                  <span onClick={handleCopyError} className="cursor-pointer underline">
                    Copy the error.
                  </span>
                  {showSuccessIcon && <FontAwesomeIcon icon={faClipboardCheck} className="text-lg ml-2" />}
                </p>
              </div>
              <button onClick={handleClose} className="primary-btn">
                Close
              </button>
            </div>
          )}
          {data && (
            <div className="flex flex-col gap-6 mt-6">
              <div className="success-container text-center">
                <h2 className="">All done!</h2>
                <p>Withdraw transaction successful</p>
              </div>
              <button onClick={handleClose} className="primary-btn">
                Ok, close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawTransactionModal;
