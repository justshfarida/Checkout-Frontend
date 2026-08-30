import {
  useEffect,
  useReducer,
  useState,
} from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Pagination from "../components/layout/Pagination";

import ItemGrid from "../components/catalog/ItemGrid";
import ItemSkeletonGrid from "../components/catalog/ItemSkeletonGrid";

import {
  requestReducer,
  initialRequestState,
} from "../reducers/requestReducer";

import api from "../api/client";

import "./StorePage.css";

const variants = [
  "cyan",
  "lime",
  "purple",
  "blue",
  "orange",
  "pink",
];

const ITEMS_PER_PAGE = 9;

export default function StorePage({
  theme,
  onThemeToggle,
}) {
  const [state, dispatch] = useReducer(
    requestReducer,
    initialRequestState
  );

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchItems() {
      dispatch({
        type: "LOADING",
      });

      try {
        const offset =
          (page - 1) * ITEMS_PER_PAGE;

        const response = await api.get(
          "/items",
          {
            params: {
              limit: ITEMS_PER_PAGE,
              offset,
            },
          }
        );

        const fetchedItems =
          response.data.items ?? [];

        const formattedItems =
          fetchedItems.map(
            (item, index) => ({
              ...item,

              initial:
                item.name
                  ?.charAt(0)
                  .toUpperCase() || "?",

              variant:
                variants[
                  index % variants.length
                ],

              soldOut:
                item.stock <= 0,
            })
          );

        dispatch({
          type: "SUCCESS",
          payload: formattedItems,
        });

        setTotal(
          response.data.total ?? 0
        );
      } catch (error) {
        console.error(error);

        dispatch({
          type: "ERROR",
          payload:
            "The catalogue could not be loaded.",
        });
      }
    }

    fetchItems();
  }, [page]);

  const {
    data: items,
    isLoading,
    error,
  } = state;

  const totalPages = Math.ceil(
    total / ITEMS_PER_PAGE
  );

  return (
    <div className="store-page">
      <Navbar />

      <main className="store-page__main">
        <section className="store-page__catalog">
          {isLoading && (
            <ItemSkeletonGrid />
          )}

          {!isLoading && error && (
            <div className="store-page__error">
              <h2 className="store-page__error-title">
                {error}
              </h2>
            </div>
          )}

          {!isLoading &&
            !error &&
            items.length === 0 && (
              <p className="store-page__message">
                No items available.
              </p>
            )}

          {!isLoading &&
            !error &&
            items.length > 0 && (
              <>
                <ItemGrid items={items} />

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
        </section>
      </main>

      <Footer
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
    </div>
  );
}