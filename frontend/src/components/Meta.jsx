const Meta = ({ title, description, keywords }) => (
  <>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
  </>
);

Meta.defaultProps = {
  title: "Welcome to ProShop",
  description: "We sell the best products for the best price.",
  keywords: "electronics, buy electronics, cheap electronics",
};

export default Meta;
