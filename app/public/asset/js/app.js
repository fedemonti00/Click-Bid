const { createApp } = Vue;

createApp({
  data() {
    return {
      authenticated: false,

      error: "",
      username: "",
      password: "",
      repeatPassword: "",
      name: "",
      surname: "",

      loggedUserData: [],
      loggedUserActiveAuctions: [],
      loggedUserExpiredAuctions: [],
      userAuctions: [],

      auctionData: {
        title: "",
        description: "",
        expiryDate: "",
        initialValue: "",
      },

      searchAuctionsQuery: "",
      upcomingAuctions: [],
      expiredAuctions: [],
      auction: [],
      isExpired: localStorage.getItem("isExpired") === false,

      searchUsersQuery: "",
      userInfo: [],
      userActiveAuctions: [],
      userExpiredAuctions: [],
      users: [],

      isFromAuction: false,

      editedAuctionID: "",

      userBid: "",
      auctionBids: "",
      bidInfo: "",
    };
  },

  watch: {
    isExpired(newValue) {
      localStorage.setItem("isExpired", newValue);
    }
  },

  computed: {
    filteredAuctions() {
      return this.isExpired === false ? this.upcomingAuctions : this.expiredAuctions;
    }
  },

  mounted() {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (isAuthenticated) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }

    this.searchAuctions();

    this.$nextTick(() => {
      const popoverElements = document.querySelectorAll('.auction-bids');

      if (popoverElements.length > 0) {
        popoverElements.forEach((el) => {
          new bootstrap.Popover(el, {
            trigger: "hover focus",
            placement: "top",
          });
        });
      }
    });

  },

  methods: {

    resetError() {
      this.error = "";
    },

    toggleTab(tabIndex) {
      let tabs = document.getElementsByClassName("tab");
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
      }
      tabs[tabIndex].style.display = "block";

      let buttons = document.getElementsByClassName("tab-button");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active-tab-button");
      }

      buttons[tabIndex].classList.add("active-tab-button");
    },

    scrollToTab(tabId) {
      const targetTab = document.getElementById(tabId);
      if (targetTab) {
        targetTab.scrollIntoView({ behavior: "smooth" });
      }
    },

    async singIn() {
      const user = {
        username: this.username,
        password: this.password,
      };

      try {
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          this.resetError();
          localStorage.setItem("authenticated", "true");
          window.location.replace("/");
        } else {
          this.error = "Username or password are not correct";
        }
      } catch (error) {
        this.error = error;
      }
    },

    async signUp() {
      if (this.password !== this.repeatPassword) {
        this.error = "Passwords are different";
      } else {
        const newUser = {
          username: this.username,
          name: this.name,
          surname: this.surname,
          password: this.password,
        };

        try {
          const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });

          const data = await response.json();

          if (response.status === 201) {
            this.resetValues();
            window.location.replace("/");
          } else if (response.status === 409) {
            this.error = data.message;
          } else if (response.status === 400) {
            this.error = data.message;
          }
        } catch (error) {
          this.error = error;
        }
      }
    },

    resetValues() {
      this.error = "";
      this.username = "";
      this.password = "";
      this.repeatPassword = "";
      this.name = "";
      this.surname = "";
    },

    resetAuctionData() {
      this.auctionData.title = "";
      this.auctionData.description = "";
      this.auctionData.expiryDate = "";
      this.auctionData.startingBid = "";
      this.error = "";
    },

    async submitNewAuction() {

      const expiryDate = new Date(this.auctionData.expiryDate).toISOString();

      const auctionData = {
        title: this.auctionData.title,
        description: this.auctionData.description,
        expiryDate: expiryDate,
        startingBid: this.auctionData.startingBid,
      };

      try {
        const response = await fetch("/api/auctions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(auctionData),
        });

        const data = await response.json();

        if (response.status === 201) {
          this.resetAuctionData();
          window.location.replace("/");
        } else if (response.status === 500) {
          this.error = data.message;
        } else if (response.status === 400) {
          this.error = data.message;
        }
      } catch (error) {
        this.error = error;
      }

    },

    async getAuctions(username, id) {

      if (id === null && username === null) {
        this.error = "You have to declare at least on of the two parameters different by null";
        return;
      }

      if (username !== null) {
        let url = `/api/auctions/?q=${username}&flag=0`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
          });

          const data = await response.json();

          if (response.status === 200) {
            this.userAuctions = data;
            this.resetError();
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = error;;
        }
      } else {

        let url = `/api/auctions/${id}`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
          });

          const data = await response.json();

          if (response.status === 200) {
            this.auction = data;
            this.resetError();
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = error;
        }
      }
    },

    async searchAuctions() {
      let url = "/api/auctions";

      if (this.searchAuctionsQuery !== "") {
        url = `/api/auctions/?q=${this.searchAuctionsQuery}`
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "content-type": "application/json" },
        });

        const data = await response.json();

        if (response.status === 200) {
          this.upcomingAuctions = data.upcoming;
          this.expiredAuctions = data.expired;
          this.resetError();
        } else if (response.status === 404) {
          this.error = data.message;
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = error;
      }

    },

    resetAuction() {
      this.auction = [];
    },

    async getUserInfo(username, id) {

      if (id === null && username === null) {
        this.error = "You have to declare at least on of the two parameters different by null";
        return;
      }

      if (username !== null) {
        let url = `/api/users/?q=${username}&flag=0`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
          });

          const data = await response.json();

          if (response.status === 200) {
            this.userInfo = data;
            this.resetError();
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = error;
        }
      } else {

        let url = `/api/users/${id}`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
          });

          const data = await response.json();

          if (response.status === 200) {
            this.userInfo = data;
            this.resetError();
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = error;
        }
      }

      url = `/api/auctions/?q=${this.userInfo.username}&flag=0`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "content-type": "application/json" },
        });

        const data = await response.json();

        if (response.status === 200) {
          this.userActiveAuctions = data.upcoming;
          this.userExpiredAuctions = data.expired;
          this.resetError();
        } else if (response.status === 404) {
          this.error = data.message;
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = error;
      }

    },

    async searchUser() {

      let url = '/api/users'

      if (this.searchUsersQuery !== "") {
        url = `/api/users/?q=${this.searchUsersQuery}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "content-type": "application/json" },
        });

        const data = await response.json();

        if (response.status === 200) {
          this.users = data;
          this.resetError();
        } else if (response.status === 404) {
          this.error = data.message;
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = error;
      }
    },

    setIsFromAuction(value = false) {
      this.isFromAuction = value;
    },

    async getLoggedUserInfo() {
      if (this.authenticated) {
        try {
          const response = await fetch("/api/whoami", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const Userdata = await response.json();

          if (response.status === 200) {
            
            this.loggedUserData = Userdata;

            let url = `/api/auctions/?q=${this.loggedUserData.username}&flag=0`;
            try {
              const response = await fetch(url, {
                method: "GET",
                headers: { "content-type": "application/json" },
              });

              const data = await response.json();

              if (response.status === 200) {               
                this.loggedUserActiveAuctions = data.upcoming;
                this.loggedUserExpiredAuctions = data.expired;
                this.resetError();
              } else if (response.status === 404) {
                this.error = data.message;
              } else {
                this.error = data.message;
              }
            } catch (error) {
              this.error = error;
            }
          } else if (response.status === 401) {
            this.error = Userdata.message;
          } else {
            this.error = Userdata.message;
          }
        } catch (error) {
          this.error = error;
        }
      }
    },

    async showEditAuction(id) {

      if (id !== null) {
        this.editedAuctionID = id;
        let url = `/api/auctions/${id}`;
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
          });

          const data = await response.json();

          if (response.status === 200) {
            this.auctionData = data;
            this.resetError();
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = error;
        }
      } else {
        this.error = "ID value can not be null";
      }
    },

    async submitEditedAuction() {
      if (this.editedAuctionID !== null) {
        let url = `/api/auctions/${this.editedAuctionID}`;
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              title: this.auctionData.title,
              description: this.auctionData.description,
            }),
          });
          
          const data = await response.json();

          if (response.ok) {
            this.resetAuctionData();
            window.location.reload();
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = error;
        }
      } else {
        this.error = "ID value can not be null";
      }
    },

    async deleteAuction(id) {

      if (id !== null) {
        let url = `/api/auctions/${id}`;

        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (response.ok) {
            this.getLoggedUserInfo();
            this.resetError();
          } else if (response.status(400)) {
            this.error = data.message;
          } else if (response.status(401)) {
            this.error = data.message;
          } else if (response.status(403)) {
            this.error = data.message;
          } else if (response.status(404)) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = "An error occurred, please try again later";
        }
      } else {
        this.error = "ID value can not be null";
      }
    },

    async makeABid(id) {

      if (id !== null) {
        let url = `/api/auctions/${id}/bids`;
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bidValue: this.userBid, }),
          });
          const data = await response.json();
          if (response.status === 201) {
            await this.getAuctions(null, id);
            await this.getAuctions();
            await this.getAuctionBids(id);
            return;
          } else if (response.status === 400) {
            this.error = data.message;
          } else if (response.status === 403) {
            this.error = data.message;
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }

        } catch (error) {
          this.error = error;
        }
      } else {
        this.error = "ID value can not be null";
      }
    },

    async getAuctionBids(id) {
      if (id !== null) {
        let url = `/api/auctions/${id}/bids`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          if (response.status === 200) {
            this.auctionBids = data;
            this.resetError();
          } else if (response.status === 400) {
            this.error = data.message;
          } else if (response.status === 404) {
            this.error = data.message;
          } else {
            this.error = data.message;
          }
        } catch (error) {
          this.error = "An error occurred, please try again later";
        }
      } else {
        this.error = "ID value can not be null";
      }
    },

    async openAuctionModal(auctionId) {
      await this.getAuctions(null, auctionId);
      await this.getAuctionBids(auctionId);
    },

    async getBidInfo(id) {
      if (id === null) {
        this.error = "ID can not be null";
        return;
      }

      const url = `/api/bids/${id}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.status === 200) {
          this.resetError();
          this.bidInfo = data.bidDate;

          this.$nextTick(() => {
            const popoverElements = document.querySelectorAll('.auction-bids');

            popoverElements.forEach((el) => {

              let popoverInstance = bootstrap.Popover.getInstance(el);
              if (popoverInstance) {
                try {
                  popoverInstance.dispose();
                } catch (error) {
                  console.warn("Popover dispose error:", error);
                }
              }

              new bootstrap.Popover(el, {
                trigger: "hover focus",
                placement: "top",
              });
            });
          });


        } else if (response.status === 404) {
          this.error = data.message;
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred, please try again later";
      }
    }

  },

}).mount("#app");
