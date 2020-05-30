import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'bisheng/router';
import { useIntl } from 'react-intl';
import { Divider, Row, Col, Card, Typography, Skeleton } from 'antd';
import { getChildren } from 'jsonml.js/lib/utils';
import { getMetaDescription, getLocalizedPathname, getThemeConfig } from '../utils';
import * as utils from '../utils';

const { Title } = Typography;
const ComponentOverview = ({
  componentsData = [],
  doc: {
    meta: { title },
    content,
  },
  utils: { toReactComponent },
}) => {
  const { locale } = useIntl();
  const documentTitle = `${title} - Ant Design`;
  const contentChild = getMetaDescription(getChildren(content));
  const themeConfig = getThemeConfig();
  const menuItems = utils.getMenuItems(
    componentsData,
    locale,
    themeConfig.categoryOrder,
    themeConfig.typeOrder,
  );

  return (
    <section className="markdown">
      <Helmet encodeSpecialCharacters={false}>
        <title>{documentTitle}</title>
        <meta property="og:title" content={documentTitle} />
        {contentChild && <meta name="description" content={contentChild} />}
      </Helmet>
      <h1>{title}</h1>
      {toReactComponent(['section', { className: 'markdown' }].concat(getChildren(content)))}
      <Divider />
      <Suspense fallback={<Skeleton />}>
        {menuItems
          .filter(i => i.order > -1)
          .map(group => (
            <div key={group.title}>
              <Title level={2} className="group-title">
                {group.title}
              </Title>
              <Row gutter={[24, 24]} className="components-overview">
                {group.children
                  .sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
                  .map(component => {
                    const url = `${component.filename
                      .replace(/(\/index)?((\.zh-cn)|(\.en-us))?\.md$/i, '')
                      .toLowerCase()}/`;
                    return (
                      <Col
                        xs={24}
                        sm={12}
                        lg={8}
                        xl={6}
                        className="container"
                        key={component.title}
                      >
                        <Link to={getLocalizedPathname(url, locale === 'zh-CN')}>
                          <Card
                            size="small"
                            className="card"
                            title={
                              <div className="title">
                                {component.title} {component.subtitle}
                              </div>
                            }
                          >
                            <div className="img">
                              <img src={component.cover} alt={component.title} />
                            </div>
                          </Card>
                        </Link>
                      </Col>
                    );
                  })}
              </Row>
            </div>
          ))}
      </Suspense>
    </section>
  );
};

export default ComponentOverview;
