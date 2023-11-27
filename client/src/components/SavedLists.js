import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";

const SavedLists = (props) => {
  const [expandedResults, setExpandedResults] = useState([]);
  const [expandedHeroes, setExpandedHeroes] = useState([]);
  const [heroLists, setLists] = useState();
  const [reviewsExpanded, setReviewsExpanded] = useState([]);
  const [newListName, setnewListName] = useState("");
  const [heroIDs, setheroIDs] = useState([]);
  const [description, setDes] = useState("");
  const [isPublic, setPublic] = useState(0);

  const user = props.user ? props.user : false;

  const toggleExpansion = (index) => {
    if (expandedResults.includes(index)) {
      setExpandedResults(
        expandedResults.filter((expandedIndex) => expandedIndex !== index)
      );
    } else {
      setExpandedResults([...expandedResults, index]);
    }
  };

  const toggleExpansionHeroes = (listIndex, heroIndex) => {
    const heroIdentifier = `${listIndex}-${heroIndex}`;
    if (expandedHeroes.includes(heroIdentifier)) {
      setExpandedHeroes(
        expandedHeroes.filter((expandedHero) => expandedHero !== heroIdentifier)
      );
    } else {
      setExpandedHeroes([...expandedHeroes, heroIdentifier]);
    }
  };

  const toggleReviews = (listIndex) => {
    setReviewsExpanded((prevReviewsExpanded) =>
      prevReviewsExpanded === listIndex ? null : listIndex
    );
  };

  useEffect(() => {
    getLists();
  }, []);

  const getLists = async () => {
    try {
      const response = await fetch(`/api/lists/saved-lists/${user.id}`);
      const lis = await response.json();

      if (!response.ok) {
        console.error(
          `Request to fetch lists failed with status ${response.status}: ${response.statusText}`
        );
      } else {
        console.log(lis);
        setLists(lis);
      }
    } catch (error) {
      console.error("Error fetching Public Lists:", error.message);
    }
  };

  const newList = async () => {
    try {
      const newList = {
        userID: user.id,
        listName: newListName,
        heroIDs: heroIDs,
        nickname: user.nName,
        ratings: [],
        description: description,
        public: isPublic,
      };

      const send = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newList),
      };

      const response = await fetch("/api/lists/add-review", send);
      const res = await response.json();

      if (!response.ok) {
        console.error(
          `Request to add new listfailed with ${response.status}: ${response.statusText}`
        );
      } else {
        console.log("all good");
        console.log(res);
        getLists();
      }
    } catch (error) {
      console.error("Error adding new review.", error.message);
    }
  };

  return (
    <div className="public-lists">
      <h1>My Hero Lists</h1>

      {heroLists !== null && heroLists !== undefined && (
        <div>
          {heroLists.map((list, index) => (
            <div key={index} className="search-result">
              <div
                className="result-header"
                onClick={() => toggleExpansion(index)}
              >
                <h3>
                  {" "}
                  {list.ListName}
                  {expandedResults.includes(index) ? ` ▲` : " ▼"}
                </h3>
              </div>
              {expandedResults.includes(index) && (
                <div className="result-details">
                  <p>Description: {list.description} </p>
                  {list.heroes.map((hero, heroIndex) => (
                    <div key={heroIndex}>
                      <div key={heroIndex} className="search-result">
                        <div
                          className="result-header"
                          onClick={() =>
                            toggleExpansionHeroes(index, heroIndex)
                          }
                        >
                          <p id="hero-title">
                            {hero.name}
                            {expandedHeroes.includes(`${index}-${heroIndex}`)
                              ? ` ▲`
                              : " ▼"}
                          </p>
                        </div>
                        {expandedHeroes.includes(`${index}-${heroIndex}`) && (
                          <div className="hero-details">
                            <p className="hero-detail-item">
                              <span className="detail-label">Publisher:</span>{" "}
                              {hero.Publisher}
                              <br />
                              <span className="detail-label">Gender:</span>{" "}
                              {hero.Gender}
                              <br />
                              <span className="detail-label">Race:</span>{" "}
                              {hero.Race}
                              <br />
                              <span className="detail-label">
                                Alignment:
                              </span>{" "}
                              {hero.Alignment}
                              <br />
                              <span className="detail-label">
                                Hair Color:
                              </span>{" "}
                              {hero["Hair color"]}
                              <br />
                              <span className="detail-label">
                                Skin Color:
                              </span>{" "}
                              {hero["Skin color"]}
                              <br />
                              <span className="detail-label">
                                Eye Color:
                              </span>{" "}
                              {hero["Eye color"]}
                              <br />
                              <span className="detail-label">Height:</span>{" "}
                              {hero["Height"]}
                              <br />
                              <span className="detail-label">Weight:</span>{" "}
                              {hero.Weight}
                              <br />
                              <span className="detail-label">Powers:</span>{" "}
                              {hero.powers.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {list.public == 1 && (
                    <div>
                      <div
                        className="result-header"
                        onClick={() => toggleReviews(index)}
                      >
                        <h4>
                          Reviews
                          {reviewsExpanded === index ? " -" : " +"}
                        </h4>
                      </div>
                      {reviewsExpanded === index && (
                        <div className="reviews">
                          {list.reviews.map((review, index) => (
                            <div key={index} className="reviews">
                              <div className="review-item">
                                <span className="rev-label">Name:</span>{" "}
                                {review.user}
                              </div>
                              <div className="review-item">
                                <span className="rev-label">Rating:</span>{" "}
                                {review.rating}/5
                              </div>
                              <div className="review-item">
                                <span className="rev-label">Comment:</span>{" "}
                                {review.comment}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLists;