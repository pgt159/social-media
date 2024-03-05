// @ts-nocheck
"use client";
import {
  serviceAddFriend,
  serviceGetHistorySearch,
  serviceGetListUser,
} from "@/app/home/store/service";
import lodash from "lodash";

import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import Empty from "../../empty/Empty";
import SkeletonLoading from "./SkeletonLoading";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useAppSelector } from "@/lib/hooks";

const HeaderSearch = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const user = useAppSelector((state) => state.auth.user);

  const [listSearch, setListSearch] = useState([]);
  const [listHistory, setListHistory] = useState([]);
  const [isSearch, setIsSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef();
  const router = useRouter();

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    width: 300,
    height: 400,
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  useEffect(() => {
    if (open) {
      getListHistory();
    }
  }, [open]);

  const handleSearchBar = async () => {
    try {
      setLoading(true);
      if (!inputRef.current.value) {
        getListHistory();
        setListSearch([]);
        return;
      }
      const result = await serviceGetListUser({
        name: inputRef.current.value || "",
      });
      if (result.status === 200) {
        setListSearch(result.data.data);
      } else {
        setListSearch([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    lodash.debounce(handleSearchBar, 300),
    []
  );

  const handleClose = (event, reason) => {
    setOpen(false);
    setListSearch([]);
    setListHistory([]);
  };

  const getListHistory = async () => {
    try {
      setLoading(true);
      const result = await serviceGetHistorySearch();
      if (result.status === 200) {
        setListHistory(result.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProfile = (id: string) => {
    if (!id) return;
    router.push(`/profile/${id}`);
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const result = await serviceAddFriend(friendId);
      if (result.status === 200) {
        const index = listSearch.findIndex((item) => item._id === friendId);
        if (index <= -1) return;
        let newListSearch = [...listSearch];
        newListSearch[index] = {
          ...newListSearch[index],
          friendRequest: [...newListSearch[index].friendRequest, user?._id],
        };
        setListSearch([...newListSearch]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <SearchBar
          inputRef={inputRef}
          isSearch={isSearch}
          setIsSearch={setIsSearch}
          getListHistory={getListHistory}
          setListSearch={setListSearch}
          color={neutralLight}
          debouncedSearch={debouncedSearch}
        />
        {loading ? (
          <SkeletonLoading />
        ) : (
          <Box
            sx={{
              flex: 1,
              height: "100%",
              overflow: "scroll",
            }}
          >
            {listHistory?.length && isSearch.length <= 0 ? (
              <Typography className="text-nDark font-semibold">
                Recent
              </Typography>
            ) : null}
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {isSearch && isSearch.length && listSearch?.length ? ( // if there is content in search bar and CAN find result
                listSearch.map((item, index) => (
                  <ListItem
                    key={item?._id}
                    sx={{
                      width: "100%",
                      p: 0,
                    }}
                  >
                    <IconButton
                      sx={{
                        gap: "0.5rem",
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        borderRadius: "9px",
                        alignItems: "flex-start",
                        mb: "0.5rem",
                      }}
                      onClick={() => handleGoToProfile(item?._id)}
                    >
                      <Image
                        className="rounded-[50%]"
                        alt="user_avatar"
                        src={
                          item?.imagePath || "/static/images/default-avatar.jpg"
                        }
                        height={35}
                        width={35}
                      />
                      <ListItemText
                        primary={
                          <Typography
                            sx={{ display: "inline", textAlign: "left" }}
                            component="span"
                            fontWeight={"500"}
                            className="line-clamp-1 text-ellipsis"
                          >
                            {`${item?.firstName} ${item?.lastName}`}
                          </Typography>
                        }
                      />
                    </IconButton>
                    {item?.friend?.includes(user?._id) ||
                    item?.friendRequest?.includes(user?._id) ||
                    item?.friendRequested?.includes(user?._id) ? null : (
                      <IconButton
                        onClick={(e) => {
                          handleAddFriend(item?._id);
                        }}
                      >
                        <PersonAddAlt1Icon />
                      </IconButton>
                    )}
                  </ListItem>
                ))
              ) : isSearch?.length <= 0 ? (
                listHistory?.length > 0 ? ( // if there is no content in search bar
                  listHistory.map((item) => (
                    <IconButton
                      sx={{
                        borderRadius: "9px",
                        flex: 1,
                        display: "block",
                        mb: "0.5rem",
                        width: "100%",
                        textAlign: "left",
                      }}
                      key={item._id}
                      onClick={() => {
                        setIsSearch(item.searchContent);
                        debouncedSearch();
                      }}
                    >
                      <Typography
                        sx={{}}
                        fontWeight={"500"}
                        className="line-clamp-1 text-ellipsis"
                      >
                        {item.searchContent}
                      </Typography>
                    </IconButton>
                  ))
                ) : (
                  <Empty
                    title="Let's find you a friend"
                    description="Type your friend's name in the input"
                  />
                )
              ) : isSearch?.length > 0 && listSearch?.length <= 0 ? ( // if there is content in search bar and CANNOT find result
                <Empty title="There's no one here" />
              ) : null}
            </List>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default React.memo(HeaderSearch);
