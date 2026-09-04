import VideoSection from "./VideoSection";
import ResponseFooter from "./ResponseFooter";

export default function MainContent() {
  return (
    <>
  <div className="main-wrapper">
    <div id="intro" className="intro">
      <div className="scroll-animations">
        <div className="hero-slide">
          <div className="hero-slide__head" style={{ display: "none" }}>
            <div className="hero-slide__head-is1 perspective">
              <h1 data-w-id="8995ea1c-a38e-c732-729b-3eef13438be3" className="h1 white">Interbank-grade Capital</h1>
            </div>
            <div className="hero-slide__head-is2 perspective">
              <h1 data-w-id="8995ea1c-a38e-c732-729b-3eef13438be5" className="h1 white">Markets Protocol</h1>
            </div>
            <div className="hero-slide__head-is3 perspective">
              <div data-w-id="96c5a99d-f3e1-44a3-c049-ce568e2ecf6c" className="hero-slide__last-h-container perspective">
                <h1 className="h1 white">meets</h1>
                <div className="hero-slide__head-line">
                  <h1 className="h1 green-font">De</h1>
                  <h1 className="h1 green-font-italic">Fi.</h1>
                  <div data-w-id="dc81127e-fc18-05a4-0196-1ecbdcec1aed" className="hero-slide__line"></div>
                </div>
              </div>
            </div>
          </div>
          <div style={{"opacity":"1"}} className="hero-slide__bt-container">
            <a href="#" className="button-container mob-hide nav-1 w-inline-block explore-btn">
              <div data-w-id="dbf30812-dd30-beaf-32a4-f096eee5f5e7" className="hero__bt-container">
                <div data-w-id="8995ea1c-a38e-c732-729b-3eef13438bf5" className="button-text">Explore</div>
                <div className="bt-ic w-embed">
                  <svg width="100%" height="100%" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" clipRule="evenodd" d="M5.00398 7.58579V0H7.00398V7.58579L10.2969 4.29289L11.7111 5.70711L6.00398 11.4142L0.296875 5.70711L1.71109 4.29289L5.00398 7.58579Z">
                    </path>
                  </svg>
                </div>
              </div>
              <div data-w-id="e9a05728-4d9b-85d2-143d-14aee99ffcff" className="menu-button__bg transparent is1"></div>
            </a>
            <a href="#" className="button-green-container margin-left mob to-footer w-inline-block">
              <div className="bt-wrapper-text">
                <div data-w-id="8995ea1c-a38e-c732-729b-3eef13438bf9" className="button-text">Sign up</div>
              </div>
              <div data-w-id="65a9b9da-f8a1-0ae8-1b80-53ce3acd00a9" className="menu-button__bg is2"></div>
            </a>
          </div>
          <div data-w-id="9785e6ca-a1df-1993-03dd-7d11ee2ddcb2" className="hero-slide__link-container">
            <div style={{"opacity":"1"}} className="hero-slide__links-container">
              <a href="#" className="hero-slide__link w-inline-block">
                <div className="body-caps">Read documentation</div>
              </a>
              <div className="share">
                <div id="sharebtn" className="hero-slide__link">
                  <div className="body-caps">Share</div>
                </div>
                <div className="share__list">
                  <a fs-socialshare-element="facebook" href="#" className="share__link w-inline-block">
                    <div className="share__ico w-embed">
                      <svg width="100%" height="100%" fill="none" viewBox="0 0 34 34">
                        <path fill="#5163FF" d="M18.404 23.761V17.57h2.079l.31-2.413h-2.389v-1.541c0-.699.194-1.175 1.196-1.175h1.278V10.28a17.13 17.13 0 0 0-1.862-.095c-1.843 0-3.104 1.125-3.104 3.19v1.78h-2.084v2.413h2.084v6.192h2.492Z">
                        </path>
                      </svg>
                    </div>
                  </a>
                  <a fs-socialshare-element="twitter" href="#" className="share__link w-inline-block">
                    <div className="share__ico w-embed">
                      <svg width="100%" height="100%" fill="none" viewBox="0 0 34 34">
                        <path fill="#5468FA" fillRule="evenodd" d="M15.16 21.98c4.7-.117 7.267-4.027 7.267-7.425a7.57 7.57 0 0 0-.008-.338c.514-.368.96-.828 1.313-1.351a5.29 5.29 0 0 1-1.51.41c.542-.323.96-.834 1.156-1.444-.509.3-1.072.517-1.67.634a2.637 2.637 0 0 0-1.92-.825 2.62 2.62 0 0 0-2.563 3.206 7.486 7.486 0 0 1-5.421-2.728 2.605 2.605 0 0 0 .814 3.485 2.635 2.635 0 0 1-1.192-.326v.033c0 1.265.907 2.32 2.11 2.56a2.656 2.656 0 0 1-1.188.045 2.63 2.63 0 0 0 2.457 1.813 5.304 5.304 0 0 1-3.89 1.08v.002a7.484 7.484 0 0 0 3.874 1.169h.371Z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </a>
                  <a fs-socialshare-element="linkedin" href="#" className="share__link w-inline-block">
                    <div className="share__ico w-embed">
                      <svg width="100%" height="100%" fill="none" viewBox="0 0 34 34">
                        <path fill="#5367FC" d="M13.598 21.363h-2.48v-7.952h2.48v7.952Zm-1.244-9.044a1.43 1.43 0 1 1 0-2.86c.79 0 1.44.638 1.44 1.434 0 .796-.642 1.426-1.44 1.426Zm10.533 9.044h-2.48v-3.87c0-.925-.019-2.11-1.291-2.11-1.292 0-1.487 1.01-1.487 2.046v3.934h-2.48v-7.952h2.378v1.083h.037c.335-.63 1.143-1.286 2.35-1.286 2.508 0 2.973 1.647 2.973 3.786v4.37Z">
                        </path>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div data-w-id="37d13c98-9f01-0610-030e-fefc97e35e90" className="hero-slide__oval-container">
            <img src="/images/arc-mask.png?v=clean" loading="lazy" height="5494" width="2880" alt="" className="hero-slide__oval-img" />
            <div className="hero-slide__fill-side-1"></div>
            <div className="hero-slide__fill-side-2"></div>
          </div>
          <div className="menu-animation-dummy"></div>
        </div>
        <div className="scroll-anim__video-wrapper">
          <div id="child-iframe" className="scroll-anim__2s-video w-embed w-iframe">
            
            
          </div>
        </div>
        <div data-w-id="9ba60a25-a01d-fe95-dca5-f459e87e9d18" className="hero-slide__fill-bg"></div>
      </div>
      <div className="scroll-wrapper">
        <div className="header"></div>
        <div data-w-id="3dea77b0-e23b-aaa2-cac3-98bd744e3dea" className="anim-area-100vh"></div>
        <div id="intro-anim" className="intro">
          <div data-w-id="84478833-fd79-2bd1-f607-afa7afff23ca" className="hero-quote">
            <div className="hero-quote__text-block">
              <h2 className="h3-large is-quote">
                <span className="hero-quote__span is1 perspective">Interbank-grade Capital Markets</span>
                <span className="hero-quote__span is2 perspective">Protocol. Building a trillion dollar-</span><span className="hero-quote__span is3 perspective">scale transaction platform that’s</span>
                <span className="hero-quote__span is4 perspective">open to everyone, connecting</span>
                <span className="hero-quote__span is5 perspective">groundbreaking technologies with</span>
                <span className="hero-quote__span is6 perspective">battle-tested interbanking standards.</span>
              </h2>
            </div>
          </div>
          <div data-color="transparent" className="frame-container">
            <div data-w-id="84478833-fd79-2bd1-f607-afa7afff23da" className="_1-slide _2s-card--anim">
              <div className="scroll-anim__1s-text-container">
                <div className="scroll-anim__1s-heading">
                  <div className="scroll-anim__1s-h-container-1 anim-h-is1">
                    <h2 className="h2 light">New</h2>
                    <div className="scroll-anim__1s-h-img"></div>
                    <h2 className="h2 light">era</h2>
                  </div>
                  <div className="scroll-anim__1s-h-container-2 anim-h-is2">
                    <h2 className="h2 light">of investing</h2>
                  </div>
                  <div className="scroll-anim__1s-description anim-desc">
                    <div className="body-text-l light">
                      We are on the verge of a new era for investing: where the market scales from billions to
                      trillions, with unprecedented opportunities available to all.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-w-id="84478833-fd79-2bd1-f607-afa7afff23e9" className="_2-slide _2s-card--anim">
              <div className="scroll-anim__2s-text-container">
                <div className="scroll-anim__2s-heading perspective">
                  <div className="scroll-anim__2s-h-container-1 anim-h-is1">
                    <div className="scroll-anim__2s-h-img"></div>
                    <h2 className="h2 light">Realiable</h2>
                  </div>
                  <div className="scroll-anim__2s-h-container-2 anim-h-is2">
                    <h2 className="h2 light">yield curve</h2>
                  </div>
                </div>
                <div className="scroll-anim__2s-description anim-desc">
                  <div className="body-text-l light">
                    Long-term exchanges, efficient collateral management and hedging cannot happen without a standard
                    interest rate, based on a reliable yield curve
                  </div>
                </div>
              </div>
            </div>
            <div data-w-id="84478833-fd79-2bd1-f607-afa7afff23f6" className="_3-slide _2s-card--anim">
              <div className="scroll-anim__3s-text-container">
                <div className="scroll-anim__3s-heading perspective">
                  <div className="scroll-anim__3s-h-container-1 anim-h-is1">
                    <h2 className="h2 light">Building</h2>
                    <div className="scroll-anim__3s-h-img"></div>
                  </div>
                  <div className="scroll-anim__3s-h-container-2 anim-h-is2">
                    <h2 className="h2 light">the future</h2>
                  </div>
                  <div className="scroll-anim__3s-description anim-desc">
                    <div className="body-text-l light">
                      At Secured Finance, we connect ground-breaking DeFi technologies with battle-tested interbanking
                      standards. Building a responsive, elegant infrastructure that takes you to the future.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-w-id="84478833-fd79-2bd1-f607-afa7afff2405" className="_4-slide">
              <div className="scroll-anim__4s-text-container">
                <div className="scroll-anim__4s-ftrs-item">
                  <div data-w-id="84478833-fd79-2bd1-f607-afa7afff2408" className="scroll-anim__4s-ftrs-img-container">
                    <div className="scroll-anim__4s-ftrs-img-1">
                      <div className="scroll-anim__4s-ftrs-circle-1-1"></div>
                      <div className="scroll-anim__4s-ftrs-circle-1-2"></div>
                    </div>
                  </div>
                  <div data-w-id="84478833-fd79-2bd1-f607-afa7afff240c" className="scroll-anim__4s-ftrs-text">
                    <h4 className="h3 light">Real yield<br /></h4>
                    <h4 className="h3 light">Curve</h4>
                    <div className="body-text gray top-margin-30px mob-centre text-white">
                      Interest rates negotiation, counterparty finding, collateral management made easy. Ensuring
                      no-arbitrage pricing via open orderbook.
                    </div>
                  </div>
                </div>
                <div className="scroll-anim__4s-ftrs-item">
                  <div data-w-id="84478833-fd79-2bd1-f607-afa7afff2415" className="scroll-anim__4s-ftrs-img-container">
                    <div className="scroll-anim__4s-ftrs-img-2">
                      <div className="scroll-anim__4s-ftrs-circle-2-1"></div>
                      <div className="scroll-anim__4s-ftrs-circle-wrapper-2-2">
                        <div className="scroll-anim__4s-ftrs-circle-2-2"></div>
                      </div>
                    </div>
                  </div>
                  <div data-w-id="84478833-fd79-2bd1-f607-afa7afff241a" className="scroll-anim__4s-ftrs-text">
                    <h4 className="h3 light">Composability</h4>
                    <h4 className="h3 light">&amp; Scalability</h4>
                    <div className="body-text gray top-margin-30px mob-centre text-white">
                      Yield curve as one market to enable interpolating and composing interest rates. Netting enables
                      reduced collateral and leverage on derivatives.
                    </div>
                  </div>
                </div>
                <div className="scroll-anim__4s-ftrs-item">
                  <div data-w-id="84478833-fd79-2bd1-f607-afa7afff2422" className="scroll-anim__4s-ftrs-img-container">
                    <div className="scroll-anim__4s-ftrs-img-3">
                      <div className="scroll-anim__4s-ftrs-circle-3-1"></div>
                      <div className="scroll-anim__4s-ftrs-circle-3-2"></div>
                    </div>
                  </div>
                  <div data-w-id="84478833-fd79-2bd1-f607-afa7afff2426" className="scroll-anim__4s-ftrs-text">
                    <h4 className="h3 light">Forward</h4>
                    <h4 className="h3 light">Loan &amp; NDFs</h4>
                    <div className="body-text gray top-margin-30px mob-centre text-white">
                      Composing forward loan to manage future cash-flow. NDFs allow manageing cross-currency without
                      suffeeing cross chain risks.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-w-id="085dbf5a-0c44-9d23-ab94-4d8be1a0920f" className="trigger-frame-animate"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="pointer-wrapper">
      <div data-w-id="29e1fbe2-d5e7-4eba-667d-9dc3534c6a34" className="wrapper-s0">
        <div className="_5s-wrapper">
          <div className="_5s">
            <div className="_5s__heading perspective">
              <h2 data-w-id="62159921-5615-0bab-eba9-bb6c48307efb" className="h1 align-left light">All-in-one capital</h2>
              <div data-w-id="bf9745ec-22c5-ccc5-c468-c327e68023ec" className="_5s-head-line">
                <h2 className="h1 align-left light">market</h2>
                <div className="_5s-line-item">
                  <h2 className="h1 align-left italic">platform</h2>
                  <div className="_5s-line"></div>
                </div>
                <div className="_5s-line-item white">
                  <h2 className="h1 align-left">for</h2>
                </div>
              </div>
              <h2 data-w-id="604738b8-78f1-acc4-616e-61174fc35f3e" className="h1 align-left light">digital asset</h2>
              <h2 data-w-id="7bea2957-4f72-1179-b0ab-df1aafd98bc7" className="h1 align-left light">investors</h2>
            </div>
            <div className="_5s-description">
              <div data-w-id="31c50989-4076-d814-dd3d-ed77c85e356c" className="body-text light">
                Secured Finance develops protocol and platform for fixed-rate loans to bring derivative structuring
                capability for digital assets.
              </div>
            </div>
            <a href="#footer" data-w-id="c0d70e7f-3ef0-08e1-c62f-bbba9df1e9af" className="button-green-container is-relative w-inline-block">
              <div className="button-text-t">Sign up</div>
              <div className="bt-ic hidden w-embed">
                <svg width="100%" height="100%" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" clipRule="evenodd" d="M7.58579 6.99992L-2.05754e-07 6.99992L-2.93177e-07 4.99992L7.58579 4.99992L4.29289 1.70703L5.70711 0.292818L11.4142 5.99992L5.70711 11.707L4.29289 10.2928L7.58579 6.99992Z">
                  </path>
                </svg>
              </div>
              <div className="menu-button__bg"></div>
            </a><img src="/images/app-laptop.webp" loading="lazy" sizes="(max-width: 479px) 100vw, 61vw" srcSet="
                  /images/app-laptop-p-500.webp   500w,
                  /images/app-laptop-p-800.webp   800w,
                  /images/app-laptop-p-1080.webp 1080w,
                  /images/app-laptop-p-1600.webp 1600w,
                  /images/app-laptop-p-2000.webp 2000w,/images/app-laptop.webp        2330w" alt="" className="_5s-ipad" /><img src="/images/app-phone.webp" loading="lazy" sizes="(max-width: 479px) 100vw, 30vw" srcSet="
                  /images/app-phone-p-500.webp   500w,
                  /images/app-phone-p-800.webp   800w,
                  /images/app-phone-p-1080.webp 1080w,/images/app-phone.webp        1127w" alt="" className="_5s-iphone" />
            <div className="_5s-text-mask">
              <img src="/images/text-5s.png" loading="lazy" alt="" className="_5s-big-text" />
            </div>
          </div>
          <div className="dark-menu-wrapper">
            <div data-w-id="39680133-aa6e-3c28-a19a-1cea8a3a3729" className="_6s-wrapper">
              <div data-w-id="b8f53a3a-69bf-b115-f91f-29b613cb7046" className="wrapper-s1">
                <section className="_6s">
                  <div className="_6s-header perspective">
                    <div className="_6s-h-container">
                      <h2 data-w-id="40ef0179-dd61-9a6a-caee-4471913d5903" className="h1 align-left">Our</h2>
                      <h2 data-w-id="40ef0179-dd61-9a6a-caee-4471913d5905" className="h1 align-left italic mob-margin-left">
                        Team
                      </h2>
                    </div>
                    <div className="_6s-description mob-hide">
                      <div data-w-id="40ef0179-dd61-9a6a-caee-4471913d5908" className="body-text gray">
                        We are a passionate team of industry experts and professionals in both traditional finance and
                        DeFi.
                      </div>
                    </div>
                    <a data-w-id="40ef0179-dd61-9a6a-caee-4471913d590a" href="https://medium.com/secured-finance" target="_blank" className="button-green-container mob-hide w-inline-block">
                      <div className="button-text-team black">Learn more</div>
                      <div className="menu-button__bg"></div>
                    </a>
                  </div>
                  <div data-w-id="40ef0179-dd61-9a6a-caee-4471913d590e" className="_6s-horizontal-wrapper">
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/Group-137946.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="
                                /images/Group-137946-p-500.png 500w,
                                /images/Group-137946-p-800.png 800w,/images/Group-137946.webp      926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Masa Kikuchi</h3>
                          <h5 className="h5 gray">Founder &amp; CEO</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              Computer Scientist and Former Head of Derivatives Structuring at HSBC with over 17 years
                              of experience in traditional finance. Member of Trusted Web (Web3) Council in the
                              Cabinet Secretariat of Japan
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://twitter.com/onion797jp" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/twitter.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                          <a href="https://www.linkedin.com/in/masa-senshi-kikuchi-55185a23" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/Group.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/2_2.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/2_2-p-500.png 500w, /images/2_2.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Kenji Mitsusada</h3>
                          <h5 className="h5 gray">Head of markets</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              18 years of interest rate derivatives and macro trading experience. Former Co-Head of
                              G10 FX Forwards and STIR Trading at Goldman Sachs and Hedge Fund Manager at Capula
                              Investment and Management.
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://twitter.com/mitsusada25" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/twitter.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                          <a href="https://www.linkedin.com/in/kenji-mitsusada-1107b7b/" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/Group.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/3_1.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/3_1-p-500.png 500w, /images/3_1-p-800.png 800w, /images/3_1.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Reuven Aboulker</h3>
                          <h5 className="h5 gray">Director of Engineering</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              12 years as an interest rate derivatives financial engineer in traditional finance.
                              Former technical lead in a top-tier bank. A strong believer in the Web3 revolution.
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://www.linkedin.com/in/reuven-aboulker-93b0b811/" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/Group.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/ki-won.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/ki-won-p-500.png 500w, /images/ki-won.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Ki Kwon</h3>
                          <h5 className="h5 gray">Head of Digital Strategy</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              Digital transformation specialist with a decade of innovation experience spanning across
                              Wall Street (Morgan Stanley, Goldman Sachs), FinTech (GS spinoff), and Mega Tech
                              (Microsoft).
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://www.linkedin.com/in/ki-kwon/" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/Group.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/5.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/5-p-500.png 500w, /images/5.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Timo Lee</h3>
                          <h5 className="h5 gray">Community Lead</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              Multilingual and multicultural business developer. Contributor to Web3, IPFS, and DeFi.
                              Master of Engineering from TU Berlin in the field of machine learning and transfer
                              learning.
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://twitter.com/timowlee" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/twitter.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                          <a href="https://www.linkedin.com/in/timo-lee-a64b69136/" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/Group.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/6.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/6-p-500.png 500w, /images/6.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Akihiro Tanaka</h3>
                          <h5 className="h5 gray">Smart Contract Engineer</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              Former lead engineer at Securitize with extensive Web3 skills to build a regulatory
                              compliant STO platform for financial institutions. 9 years as a software
                              engineer/architect at Accenture. A blockchain advocate since 2013.
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://twitter.com/alexanderisora" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/twitter.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/Group-137943.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/Group-137943-p-500.png 500w, /images/Group-137943.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Jasper Neo</h3>
                          <h5 className="h5 gray">Markets and Operations Specialist</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              Markets expert in operations for 8 years dealing with collateral, equities, bonds, and
                              derivative products. Former settlement analyst at FNZ and SS&amp;C. A budding enthusiast
                              trying to harness wealth’s full potential to grow through the financial revolution in
                              Web3.
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://www.linkedin.com/in/jasper-neo-a7793561/" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/Group.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/Group-137942.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/Group-137942-p-500.png 500w, /images/Group-137942.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Arpit Singh</h3>
                          <h5 className="h5 gray">Software Engineer</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              Full Stack Developer interested in both Tech and Finance. Prior experience as a Quant
                              developer for OTC trades within a top-tier bank. IIT Delhi graduate and enthusiastic
                              about the future of Web3 and Decentralized Finance.
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="#" className="_6s-link-bt hide w-inline-block"><img src="/images/twitter.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                    <div className="_6s-horizontal-card">
                      <div className="_6s-card-img-wrapper">
                        <div className="_6s-card-img-container">
                          <img src="/images/9.webp" loading="eager" sizes="(max-width: 479px) 100vw, (max-width: 767px) 138.8984375px, 14vw" srcSet="/images/9-p-500.png 500w, /images/9.webp 926w" alt="" className="_6s-card-img" />
                        </div>
                      </div>
                      <div className="_6s-card-text-container">
                        <div className="_6s-card-h-wrapper">
                          <h3 className="h3">Reza Shahi</h3>
                          <h5 className="h5 gray">Senior Advisor</h5>
                          <div className="_6s-card-description">
                            <div className="p-normal gray">
                              Reza Shahi was the Chief Operating Officer of the firm’s credit business at Citadel.
                              After Citadel, Reza worked at Sequoia Heritage which is a large multi-family office
                              within Sequoia Capital. He is now a senior advisor for Secured Finance.
                            </div>
                          </div>
                        </div>
                        <div className="_6s-link-container">
                          <a href="https://www.linkedin.com/in/reza-shahi-cfa-4039366/" target="_blank" className="_6s-link-bt w-inline-block"><img src="/images/Group.svg" loading="lazy" alt="" className="_6s-ic" /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="_6s__mob-container-bt">
                    <a href="#" className="button-green-container w-inline-block">
                      <div className="button-text-t black">Learn more</div>
                      <img src="/images/Vector-18.svg" loading="lazy" alt="" className="ic-arrow" />
                    </a>
                  </div>
                </section>
                <div data-w-id="70527781-5b61-d591-b822-f39991ce0dac" className="_7s-8s__wrapper">
                  <VideoSection />
                    <div data-w-id="0cb22d47-44cb-b74d-466b-40ceab2caf2e" className="wrapper-s3">
                      <div className="_8s-wrapper">
                        <div className="anchor-news"></div>
                        <div className="_8s">
                          <div className="_8s-container">
                            <a href="https://medium.com/secured-finance" target="_blank" className="articles-btn w-inline-block">
                              <div className="button-2-text">See more</div>
                              <div className="articles-button__bg bt-bg"></div>
                            </a>
                            <div className="_8s-header">
                              <h2 className="h1 align-left">Recent</h2>
                              <h2 className="h1 align-left italic margin-left">articles</h2>
                            </div>
                            <div className="_8s-catalog-container">
                              <div className="_8s-catalog-1">
                                <div id="w-node-_18ad697e-3863-afac-de35-10818a039df6-51c2b876" className="s8-item _1">
                                  <div className="s8-article__img-article-wrapper is-1">
                                    <img src="/images/pic1.png" srcSet="/images/pic1.png 1x, /images/pic1%402x.png 2x" loading="lazy" alt="" className="s8-img-article" />
                                  </div>
                                  <div id="w-node-_18ad697e-3863-afac-de35-10818a039df9-51c2b876" className="s8-article is-1">
                                    <div className="s8-article__h5-wrapper">
                                      <div className="h5">Interest Rate Markets in DeFi</div>
                                    </div>
                                    <div className="s8-article-text">
                                      <div className="p-normal gray">
                                        Automated Market Maker Pool or AMM Pool is one of the greatest inventions
                                        created in Decentralized Finance (DeFi).
                                      </div>
                                    </div>
                                    <div className="s8-article__date-wrapper">
                                      <div className="body-caps gray">Oct 25 2022</div>
                                    </div>
                                    <a href="https://medium.com/secured-finance/interest-rate-market-in-defi-4d5d846a9852" target="_blank" className="s8-bt-article w-button">Read now</a>
                                  </div>
                                </div>
                                <div id="w-node-_18ad697e-3863-afac-de35-10818a039e02-51c2b876" className="s8-item _2">
                                  <div className="s8-article__img-article-wrapper is-2">
                                    <img src="/images/pic2.png" srcSet="/images/pic2.png 1x, /images/pic2%402x.png 2x" loading="lazy" alt="" className="s8-img-article is-2" />
                                  </div>
                                  <div className="s8-article is-2">
                                    <div className="s8-article__h5-wrapper">
                                      <div className="h5">Secured Finance at FIL Singapore’22 Summit</div>
                                    </div>
                                    <div className="s8-article-text">
                                      <div className="p-normal gray">
                                        New brand, New app release, VC demo day, and Workshops to grow with strategic
                                        Web3 ecosystem partners
                                      </div>
                                    </div>
                                    <div className="s8-article__date-wrapper">
                                      <div className="body-caps gray">Oct 20 2022</div>
                                    </div>
                                    <a href="https://medium.com/secured-finance/secured-finance-at-fil-singapore22-summit-fe4aff760ec1" target="_blank" className="s8-bt-article w-button">Read now</a>
                                  </div>
                                </div>
                                <div id="w-node-_18ad697e-3863-afac-de35-10818a039e0e-51c2b876" className="s8-item _2">
                                  <div className="s8-article__img-article-wrapper is-2">
                                    <img src="/images/pic3.png" srcSet="/images/pic3.png 1x, /images/pic3%402x.png 2x" loading="lazy" alt="" className="s8-img-article is-2" />
                                  </div>
                                  <div className="s8-article is-2">
                                    <div className="s8-article__h5-wrapper">
                                      <div className="h5">Building ‘Real’ Yield Curve</div>
                                    </div>
                                    <div className="s8-article-text">
                                      <div className="p-normal gray">
                                        Demystifying Interest Rates Composability for Large-Scale Derivatives’
                                        Applications
                                      </div>
                                    </div>
                                    <div className="s8-article__date-wrapper">
                                      <div className="body-caps gray">Sep 20 2022</div>
                                    </div>
                                    <a href="https://medium.com/secured-finance/building-real-yield-curve-a83380126af0" target="_blank" className="s8-bt-article w-button">Read now</a>
                                  </div>
                                </div>
                              </div>
                              <div className="_8s-catalog-2">
                                <div className="s8-item _4">
                                  <div className="s8-article _2-catalog">
                                    <div className="s8-article__h5-wrapper">
                                      <div className="h5">Future of Finance IV</div>
                                    </div>
                                    <div className="s8-article-text">
                                      <div className="p-normal gray">
                                        This story is a continuation of Future of Finance III, Chapter 3 Decentralized
                                        Finance — The Future of Finance Shaped by Web 3.0
                                      </div>
                                    </div>
                                    <div className="s8-article__date-wrapper">
                                      <div className="body-caps gray">Jul 5 2022</div>
                                    </div>
                                    <a href="https://medium.com/secured-finance/future-of-finance-ⅳ-c56c30656e7a" target="_blank" className="s8-bt-article w-button">Read now</a>
                                  </div>
                                </div>
                                <div className="s8-item _4">
                                  <div className="s8-article _2-catalog">
                                    <div className="s8-article__h5-wrapper">
                                      <div className="h5">Future of Finance III</div>
                                    </div>
                                    <div className="s8-article-text">
                                      <div className="p-normal gray">
                                        This story is a continuation of Future of Finance II, Chapter 2: Information
                                        Asymmetry: The Merits and Drawbacks of Centralized Finance
                                      </div>
                                    </div>
                                    <div className="s8-article__date-wrapper">
                                      <div className="body-caps gray">May 13 2022</div>
                                    </div>
                                    <a href="https://medium.com/secured-finance/future-of-finance-ⅲ-744b9ddd81d2" target="_blank" className="s8-bt-article w-button">Read now</a>
                                  </div>
                                </div>
                                <div className="s8-item _4">
                                  <div className="s8-article _2-catalog">
                                    <div className="s8-article__h5-wrapper">
                                      <div className="h5">Future of Finance II</div>
                                    </div>
                                    <div className="s8-article-text">
                                      <div className="p-normal gray">
                                        This story is a continuation of Future of Finance I, Chapter 1: A Modern
                                        History of Financial Institutions — Changes Induced by the Once-in-a-Century
                                        Crisis
                                      </div>
                                    </div>
                                    <div className="s8-article__date-wrapper">
                                      <div className="body-caps gray">March 23 2022</div>
                                    </div>
                                    <a href="https://medium.com/secured-finance/future-of-finance-ⅱ-da9ce0cc9127" target="_blank" className="s8-bt-article w-button">Read now</a>
                                  </div>
                                </div>
                              </div>
                              <div className="s8-catalog__cl-wrapper w-dyn-list">
                                <div role="list" className="s8-catalog__cl w-dyn-items">
                                  <div role="listitem" className="s8-catalog__cl-item w-dyn-item">
                                    <div className="s8-catalog__cl-image-wrapper">
                                      <img src="" loading="lazy" alt="" className="s8-catalog__cl-image" />
                                    </div>
                                    <div className="s8-catalog__cl-h5-wrapper">
                                      <h1 className="h5"></h1>
                                    </div>
                                    <div className="s8-catalog__cl-text">
                                      <div className="p-normal"></div>
                                    </div>
                                    <div className="s8-catalog__cl-date">
                                      <div className="body-caps"></div>
                                    </div>
                                    <a href="#" className="s8-catalog__cl-bt w-button">Read now</a>
                                  </div>
                                </div>
                                <div className="w-dyn-empty">
                                  <div>No items found.</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="news" className="_8s-anchor"></div>
                    </div>
                  </div>
                  <div className="_7s-anchor"></div>
                </div>
              </div>
              <div id="about" className="_6s-anchor"></div>
              <div id="about" data-color="blue" className="color-trigger"></div>
            </div>
          </div>
        </div>
        <div id="platform" className="_5s-anchor"></div>
      </div>
      <ResponseFooter />
    </div>
    <div className="trigger-wrapper">
      <div data-w-id="a0a19611-fad6-0650-6e84-d5b36d992f45" className="trigger-video-bt"></div>
      <div data-w-id="ccd16ebb-786d-7a66-d8ec-a240a7a20ba4" className="trigger-video"></div>
    </div>
    </>
  );
}
