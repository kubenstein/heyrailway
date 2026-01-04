import styles from './Story.module.css';

export default function Story() {
  return (
    <div className={styles.host}>
      <div className={styles.avatar}>
        <i className={styles.me} />
        <span>Tokyo-based Sr. Fullstack Software Engineer</span>
        <strong>Jakub Niewczas</strong>
        <p>
          13+ years of industrial experience in building
          <br />
          and growing multi-million dollar tech projects.
        </p>
      </div>
      <div className={styles.quote}>
        <span>
          &#34;Wouldn&#39;t it be cool if the Railway UI were a train map with stations and lines, where trains go back
          and forth carrying data as cargo!&#34;
          <br />
        </span>
        <small>
          - Jakub Niewczas, during New Year&#39;s holidays
          <br />
          (psst.. He built it as a game, scroll down!)
        </small>
      </div>

      <span>
        Hey Railway team!
        <br />
        <br />
        My name is Jakub Niewczas, I&#39;m a Senior Fullstack Software Engineer with{' '}
        <em>13+ years of professional experience</em>, and while researching alternatives for fly.io, I was really
        <em>amazed by your UI!</em> I thought
        <i>
          &#34;Wouldn&#39;t it be cool if the Railway UI were a train map with stations and lines, where trains go back
          and forth carrying data as cargo!&#34;
        </i>
        <br />
        <br />
        <br />
        And so <b>I rebuilt Railway services UI as a train game</b> over the New Year&#39;s holidays! And I want to
        share it with you guys!
        <br />
        <br />
        <br />
        <em>I read your career page, blog posts</em>, and was even more amazed by your <em>working culture</em> -
        <em>it&#39;s exactly how I work</em>, how I want to work and how I can deliver the most value.
        <br />
        <br />
        As a good starter, let me share just two companies from my resume that I think are the most relevant to Railway:
        <ul>
          <li>
            I was a <em>Senior FullStack Engineer</em> at the Japanese <em>payment gateway</em> company{' '}
            <a target="_blank" href="https://en.komoju.com/" rel="noreferrer">
              Komoju
            </a>{' '}
            for several years. My responsibilities included the development of core payment logic, integrations with
            upstream services, and supporting satellite services. With such a{' '}
            <em>volume of traffic, money, regulations, flows</em>, and all sorts of other <em>responsibilities</em>, it
            was challenging but actually a very interesting project!
          </li>
          <li>
            I&#39;m a <em>Senior FullStack Engineer</em> at{' '}
            <a target="_blank" href="https://scatter.art/" rel="noreferrer">
              scatter.art
            </a>
            , an NFT marketplace in the crypto space. <em>We work in exactly the same way as you!</em> With a fully
            <em>async</em>, <em>global</em> team, leveraging Discord, Linear, having bots, and automating as much as
            possible. With a small, robust, and super smart team, <em>ownership is pushed down to each developer</em>.
            Everyone has permission from the CTO to merge without reviews in case of emergency, yet nothing ever blew
            up, and we made a bunch of people millionaires, that&#39;s for sure.
          </li>
        </ul>
        I hope these two examples demonstrate a history of successful experiences working with big codebases and tons of
        responsibilities, while leveraging the flexibility of a remote, autonomous team, and taking pride, and having
        fun in building amazing software for our customers.
        <br />
        <br />
        <br />
        Let&#39;s connect!
        <br />
        Jakub Niewczas
        <br />
        https://jakubniewczas.pl
      </span>
    </div>
  );
}
