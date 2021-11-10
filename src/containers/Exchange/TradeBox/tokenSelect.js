import { trans } from "@/i18n";
import { getLengthLimitedString } from "@/utils";
import { Avatar, Input, List, Modal, Space } from "antd";
import axios from "axios";
import { Button, Select } from "components";
import isString from "lodash/isString";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import useDeepCompareEffect from "use-deep-compare-effect";
import web3 from "web3";
import styles from "./tokenSelect.module.scss";

const i18n = (lang, ...args) =>
  trans("EXCHANGE_TRADEBOX_TOKEN_SELECT", lang, ...args);

const NUM_MAX_TOKENS_FROM_LISTS = 50;

const TokenSelect = ({
  currencies,
  onChange,
  lang,
  value,
  addToken,
  ...restProps
}) => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tokensFromTokenLists, setTokensFromTokenLists] = useState([]);
  const [importedTokensFromTokenLists, setImportedTokensFromTokenLists] =
    useState([]);
  const [addTokenAddress, setAddTokenAddress] = useState("");

  const cleanedNativeCurrencies = useMemo(
    () =>
      currencies.map(
        ({
          chain_id,
          token_address,
          name,
          symbol,
          precision,
          logo_uri,
          inner_id,
        }) => ({
          chainId: chain_id,
          address: token_address.toLowerCase(),
          name,
          symbol,
          decimals: precision,
          logoURI: logo_uri,
          innerId: inner_id,
          native: true,
        })
      ),
    [currencies]
  );

  useDeepCompareEffect(() => {
    const nativeTokenAddresses = cleanedNativeCurrencies.map(
      (token) => token.address
    );

    axios
      .get("https://tokens.coingecko.com/uniswap/all.json")
      .then(({ data }) => {
        setTokensFromTokenLists(
          data.tokens
            .map((token) => ({
              ...token,
              address: token.address.toLowerCase(),
              native: false,
              imported: false,
            }))
            .filter((token) => !nativeTokenAddresses.includes(token.address))
        );
      });
  }, [currencies]);

  const closeModal = () => {
    setShouldShowModal(false);
    setSearchKeyword("");
  };

  const submitValueAndCloseModal = (value) => {
    onChange(value);
    closeModal();
  };

  const handleTokenImport = (token) => {
    setImportedTokensFromTokenLists([
      ...importedTokensFromTokenLists,
      { ...token, imported: true },
    ]);
    const copyOfTokensFromTokenLists = [...tokensFromTokenLists];
    copyOfTokensFromTokenLists.splice(
      tokensFromTokenLists.findIndex((item) => item.address === token.address),
      1
    );
    setTokensFromTokenLists(copyOfTokensFromTokenLists);
    submitValueAndCloseModal(token.symbol);

    addToken(token.address);
  };

  const addTokenByAddress = () => {
    if (web3.utils.isAddress(addTokenAddress)) {
      addToken(addTokenAddress);
      closeModal();
    }
  };

  let shownTokens = [
    ...cleanedNativeCurrencies,
    ...importedTokensFromTokenLists,
  ];
  const searchedFieldsForExternalTokens = ["address", "name", "symbol"];
  if (searchKeyword !== "") {
    const keywordInUpperCase = searchKeyword.toUpperCase();
    shownTokens = shownTokens.filter((item) => {
      if (item.native) {
        return item.symbol.toUpperCase().includes(keywordInUpperCase);
      }
      return searchedFieldsForExternalTokens.some((fieldName) =>
        item[fieldName].toUpperCase().includes(keywordInUpperCase)
      );
    });

    let numberOfTokensFromSearchResult = 0;
    const filteredTokensFromTokenLists = tokensFromTokenLists.filter((item) => {
      if (numberOfTokensFromSearchResult < NUM_MAX_TOKENS_FROM_LISTS) {
        const isMatched = searchedFieldsForExternalTokens.some((fieldName) =>
          item[fieldName].toUpperCase().includes(keywordInUpperCase)
        );
        if (isMatched) {
          numberOfTokensFromSearchResult++;
        }
        return isMatched;
      }
      return false;
    });
    if (filteredTokensFromTokenLists.length) {
      shownTokens = [
        ...shownTokens,
        i18n(lang, "SEARCH_RESULTS_FROM_TOKEN_LISTS"),
        ...filteredTokensFromTokenLists,
      ];
    }

    if (numberOfTokensFromSearchResult === NUM_MAX_TOKENS_FROM_LISTS) {
      shownTokens.push(i18n(lang, "RESULTS_FROM_SEARCH_REACHED_LIMIT"));
    }
  }

  return (
    <>
      <Select
        className={styles.fakeSelect}
        disabled
        onClick={() => setShouldShowModal(true)}
        value={value}
        {...restProps}
      >
        {value && <Select.Option value={value}>{value}</Select.Option>}
      </Select>
      <Modal
        title={i18n(lang, "MODAL_TITLE")}
        visible={shouldShowModal}
        onCancel={closeModal}
        footer={[]}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input
            size="large"
            value={searchKeyword}
            onChange={(event) => {
              setSearchKeyword(event.target.value);
            }}
            placeholder={i18n(lang, "SEARCH_BOX_PLACEHOLDER")}
          />
          {shownTokens.length ? (
            <List
              size="small"
              dataSource={shownTokens}
              renderItem={(item) => {
                if (isString(item)) {
                  return <List.Item>{item}</List.Item>;
                }

                if (item.native) {
                  return (
                    <List.Item
                      className={styles.listItem}
                      onClick={() => {
                        submitValueAndCloseModal(item.symbol);
                      }}
                    >
                      <List.Item.Meta
                        title={item.symbol}
                        description={item.name}
                      />
                    </List.Item>
                  );
                }

                return item.imported ? (
                  <List.Item
                    className={styles.listItem}
                    onClick={() => {
                      submitValueAndCloseModal(item.symbol);
                    }}
                  >
                    <List.Item.Meta
                      title={item.symbol}
                      description={`${item.name} • ${getLengthLimitedString(
                        item.address,
                        20,
                        24
                      )}`}
                      avatar={<Avatar src={item.logoURI} />}
                    />
                  </List.Item>
                ) : (
                  <List.Item
                    actions={[
                      <Button onClick={() => handleTokenImport(item)}>
                        Import
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.symbol}
                      description={item.name}
                      avatar={<Avatar src={item.logoURI} />}
                    />
                  </List.Item>
                );
              }}
            />
          ) : (
            <>
              <p>{i18n(lang, "TOKEN_NOT_FOUND_PROMPT")}</p>
              <Input
                size="large"
                value={addTokenAddress}
                onChange={(event) => setAddTokenAddress(event.target.value)}
                placeholder={i18n(lang, "ADD_TOKEN_BY_ADDRESS_PLACEHOLDER")}
              />
              {web3.utils.isAddress(addTokenAddress) ? (
                <Button onClick={addTokenByAddress}>Import</Button>
              ) : undefined}
            </>
          )}
        </Space>
      </Modal>
    </>
  );
};

const mapDispatch = (dispatch) => ({
  addToken: dispatch.ethereum.addToken,
});

export default connect(null, mapDispatch)(TokenSelect);
