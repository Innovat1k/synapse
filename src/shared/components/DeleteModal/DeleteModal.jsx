import ButtonSpinner from "../ButtonSpinner";
import { formatDateShort } from "@utils/utils";
import { forwardRef } from "react";

const DeleteModal = forwardRef(
  (
    { entity = "skill", initialData, isSubmitting, closeModal, confirmDelete },
    ref,
  ) => {
    return (
      <div ref={ref} className="space-y-6">
        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-transparent via-rose-500/5 to-transparent pointer-events-none opacity-40"></div>

        <p className="text-slate-300 text-sm sm:text-base relative z-10 leading-relaxed">
          Are you sure you want to delete{" "}
          {entity === "skill" ? (
            <span className="font-semibold text-slate-100 capitalize wrap-break-word">
              "{initialData?.name}"
            </span>
          ) : (
            <span className="font-semibold text-slate-100 capitalize wrap-break-word">
              {""} this activity from {formatDateShort(initialData?.logged_at)}
            </span>
          )}{" "}
          ?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          {isSubmitting ? (
            <>
              <button
                type="button"
                disabled
                className="flex-1 px-6 py-2.5 order-2 md:order-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-200 rounded-lg transition-all duration-200 text-sm sm:text-base cursor-pointer font-medium"
              >
                Keep it
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 px-6 py-2.5 order-1 md:order-2 bg-rose-600/60 text-white rounded-lg text-sm sm:text-base w-full sm:flex-1 cursor-not-allowed"
              >
                <ButtonSpinner
                  color="border-white"
                  label="Deleting..."
                  labelColor="text-white"
                  inline={true}
                />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-6 py-2.5 order-2 sm:order-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-200 rounded-lg transition-all duration-200 text-sm sm:text-base cursor-pointer font-medium"
              >
                Keep it
              </button>
              <button
                type="submit"
                onClick={() => confirmDelete(initialData)}
                className="flex-1 px-6 py-2.5 order-1 sm:order-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all duration-200 text-sm sm:text-base shadow-lg shadow-rose-500/20 cursor-pointer font-bold active:scale-95"
              >
                Delete permanently
              </button>
            </>
          )}
        </div>
      </div>
    );
  },
);

DeleteModal.displayName = "DeleteModal";

export default DeleteModal;
