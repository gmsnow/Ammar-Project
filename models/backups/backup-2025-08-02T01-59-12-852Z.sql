--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_requests (
    id integer NOT NULL,
    leave_id character varying(20),
    issue_date date,
    admission_date date,
    admission_date_hijri character varying(20),
    discharge_date date,
    discharge_date_hijri character varying(20),
    leave_duration_arabic text,
    leave_duration_english text,
    name_arabic text,
    name_english text,
    national_id character varying(20),
    nationality_arabic text,
    nationality_english text,
    employer_arabic text,
    employer_english text,
    physician_arabic text,
    physician_english text,
    position_arabic text,
    position_english text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_requests OWNER TO postgres;

--
-- Name: leave_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_requests_id_seq OWNER TO postgres;

--
-- Name: leave_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_requests_id_seq OWNED BY public.leave_requests.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    number character varying,
    state character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: leave_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests ALTER COLUMN id SET DEFAULT nextval('public.leave_requests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_requests (id, leave_id, issue_date, admission_date, admission_date_hijri, discharge_date, discharge_date_hijri, leave_duration_arabic, leave_duration_english, name_arabic, name_english, national_id, nationality_arabic, nationality_english, employer_arabic, employer_english, physician_arabic, physician_english, position_arabic, position_english, created_at) FROM stdin;
176	GSL32088845	2025-07-26	2025-07-27	28-09-1446	2025-07-30	01-09-1446	4 يوم (28-09-1446 إلى 01-09-1446)	4 days (27/07/2025 to 30/07/2025)	محمد عصام  يحيى حميد	Mohamed Esam Yahya Homaid	12121212121	جزائري	Algerian	صيانه الطرق	asdsadsad	ماركوس	marcos	دكتور	doctor	2025-07-28 02:11:39.535873
177	GSL55636328	2025-07-27	2025-07-27	28-09-1446	2025-07-27	28-09-1446	1 يوم (28-09-1446 إلى 28-09-1446)	1 day (27/07/2025 to 27/07/2025)	محمد عصام حميد	Haitham Essam Homaid	12121212121	مغربي	Moroccan	صيانه الطرق	engineer	ماركوس	marcos	دكتور	doctor	2025-07-28 02:11:39.535873
178	GSL5569121	2025-07-27	2025-07-27	28-09-1446	2025-07-31	02-09-1446	5 يوم (28-09-1446 إلى 02-09-1446)	5 days (27/07/2025 to 31/07/2025)	هيقم عصام حميد	Mohamed Esam Homaid	12121212121	سوداني	Sudanese	صيانه الطرق	asdsadsad	cvb	asd	دكتور	asd	2025-07-28 02:11:39.535873
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role, created_at, number, state) FROM stdin;
11	hithamhomaid	snows005@gmail.com	12345	admin	2025-08-02 03:33:06.331925	+96777726855	active
1	admin	admin@hospital.com	admin123	admin	2025-07-19 15:11:15.002873	+967777296855	active
2	employee	employee@hospital.com	employee123	employee	2025-07-19 15:11:15.002873	+967777296855	active
8	SamaAdmin	snows6005@gmail.com	12345	admin	2025-07-30 22:24:56.194167	+967777296855	active
9	ammar	snows123@gmail.com	12345	admin	2025-07-30 22:30:23.306358	+9677726554	inactive
\.


--
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 178, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

