"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { PlayIcon, XIcon } from "@phosphor-icons/react";

export function VideoPoster({
  videoId,
  title,
  poster,
}: {
  videoId: string;
  title: string;
  poster: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  function close() {
    dialog.current?.close();
    setPlaying(false);
    trigger.current?.focus();
  }
  return (
    <>
      <button
        ref={trigger}
        className="video-trigger"
        onClick={() => {
          setPlaying(true);
          dialog.current?.showModal();
        }}
      >
        <span className="video-thumbnail">
          <Image src={poster} alt="" fill sizes="120px" />
          <span className="play-icon">
            <PlayIcon size={18} weight="fill" />
          </span>
        </span>
        <span>
          <span className="video-label">Ver vídeo</span>
          <strong>{title}</strong>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="video-dialog"
        aria-label={title}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="video-dialog-top">
          <p>{title}</p>
          <button
            type="button"
            autoFocus
            className="icon-button"
            onClick={close}
            aria-label="Fechar vídeo"
          >
            <XIcon size={24} />
          </button>
        </div>
        {playing && (
          <iframe
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
        <a
          className="video-fallback"
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noreferrer"
        >
          Abrir no YouTube
        </a>
      </dialog>
    </>
  );
}
